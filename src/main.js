const path = require('path')
const fs = require('fs')
const core = require('@actions/core')
const github = require('@actions/github')

const { getStats } = require('./lcov')
const { createComment } = require('./create-comment')
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
    const lcovFile = path.join(workingDir, core.getInput('lcov-file'))
    const shouldDeleteOldComments = core.getInput('delete-old-comments').toLowerCase() === 'true'

    if (!fs.existsSync(lcovFile)) throw new Error('lcov file does not exist. Please check the path of lcov-file.')

    const context = github.context
    const options = getOptions({ context, workingDir })

    if (shouldDeleteOldComments) {
      await deleteOldComments({ client, options, context })
    }

    const stats = await getStats(lcovFile)
    await createComment(stats, { options, context, client })
  } catch (error) {
    core.setFailed(error.message || error)
  }
}
