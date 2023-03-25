function draftComment({ totalCoverageTable }, options) {
  const title = options.base
    ? `Coverage after merging \`${options.head}\` into \`${options.base}\` will be:`
    : `Coverage for this commit:`

  return `### Coverage Report

${title}

${totalCoverageTable}`
}

exports.postComment = async function postComment(components, { options, context, client }) {
  const body = draftComment(components, options)

  if (context.eventName === 'pull_request') {
    return client.issues.createComment({
      body,
      repo: context.repo.repo,
      owner: context.repo.owner,
      issue_number: context.payload.pull_request.number,
    })
  }

  if (context.eventName === 'push') {
    return client.repos.createCommitComment({
      body,
      repo: context.repo.repo,
      owner: context.repo.owner,
      commit_sha: options.commit,
    })
  }
}
