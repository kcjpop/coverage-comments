const github = require('@actions/github')

function getClient(token) {
  const client = github.getOctokit(token).rest

  return { client, context: github.context }
}

function normalisePath(file) {
  return file.replace(/\\/g, '/')
}

function getOptions({ workingDir }) {
  const context = github.context

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

module.exports = { getClient, getOptions }
