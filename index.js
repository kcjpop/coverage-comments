const path = require('path')
const fs = require('fs')
const core = require('@actions/core')
const github = require('@actions/github')

const { getStats } = require('./lcov')

function draftComment(stats) {
  return `Comment ${stats.lines.hit} / ${stats.lines.found}`
}

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

async function createComment(comment, { options, context, client }) {
  if (context.eventName === 'pull_request') {
    return client.issues.createComment({
      repo: context.repo.repo,
      owner: context.repo.owner,
      issue_number: context.payload.pull_request.number,
      body: comment,
    })
  }

  if (context.eventName === 'push') {
    return client.repos.createCommitComment({
      repo: context.repo.repo,
      owner: context.repo.owner,
      commit_sha: options.commit,
      body: comment,
    })
  }
}

async function run() {
  try {
    const token = core.getInput('github-token')
    const client = github.getOctokit(token).rest

    const workingDir = core.getInput('working-directory') || './'
    const lcovFile = path.join(
      workingDir,
      core.getInput('lcov-file') || './coverage/lcov.info',
    )

    if (!fs.existsSync(lcovFile))
      throw new Error(
        'lcov file does not exist. Please check the path of lcov-file.',
      )

    const stats = await getStats(lcovFile)
    const comment = draftComment(stats)
    const context = github.context

    const options = getOptions({ context, workingDir })
    await createComment(comment, { options, context, client })
  } catch (error) {
    core.setFailed(error.message || error)
  }
}

run()
