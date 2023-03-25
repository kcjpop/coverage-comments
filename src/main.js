const path = require('node:path')
const fs = require('node:fs')
const core = require('@actions/core')
const github = require('@actions/github')

const lcov = require('./lcov')
const clover = require('./clover')
const { postComment } = require('./post-comment')
const { deleteOldComments } = require('./delete-old-comments')

function normalisePath(file) {
  return file.replace(/\\/g, '/')
}

function getOptions({ workingDir, context }) {
  const options = {
    repository: context.payload.repository.full_name,
    prefix: normalisePath(`${process.env.GITHUB_WORKSPACE}/`),
    workingDir,
  }

  if (context.eventName === 'pull_request') {
    return {
      ...options,
      commit: context.payload.pull_request.head.sha,
      baseCommit: context.payload.pull_request.base.sha,
      head: context.payload.pull_request.head.ref,
      base: context.payload.pull_request.base.ref,
    }
  }

  if (context.eventName === 'push') {
    return {
      ...options,
      commit: context.payload.after,
      baseCommit: context.payload.before,
      head: context.ref,
    }
  }
}

module.exports = async function run() {
  try {
    const token = core.getInput('github-token')
    const client = github.getOctokit(token).rest

    const workingDir = core.getInput('working-directory')
    const coverageFile = path.join(workingDir, core.getInput('coverage-file'))
    const shouldDeleteOldComments = core.getInput('delete-old-comments').toLowerCase() === 'true'

    if (!fs.existsSync(coverageFile)) throw new Error('File does not exist. Please check the path of `coverage-file`.')

    const context = github.context
    const options = getOptions({ context, workingDir })

    // Delete old comments first
    if (shouldDeleteOldComments) {
      await deleteOldComments({ client, options, context })
    }

    // Post new comment
    let components = null
    if (coverageFile.includes('clover.xml')) components = await clover.prepareCommentParts(coverageFile)
    else if (coverageFile.includes('lcov.info')) components = await lcov.prepareCommentParts(coverageFile)
    else throw new Error('Coverage file has to be either `clover.xml` or `lcov.info`')

    await postComment(components, { options, context, client })
  } catch (error) {
    core.setFailed(error.message || error)
  }
}
