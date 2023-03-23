function draftComment(stats, options) {
  const title = options.base
    ? `Coverage after merging \`${options.head}\` into \`${options.base}\` will be:`
    : `Coverage for this commit:`

  // prettier-ignore
  return `### Coverage Report

${title}

|                  | Hit/ Total                                            | Coverage                            |
|------------------|-------------------------------------------------------|-------------------------------------|
| 🌿 **Branches**  | \`${stats.branches.hit} / ${stats.branches.found}\`   | ${stats.branches.percentage ?? 0}%  |
| 🔢 **Functions** | \`${stats.functions.hit} / ${stats.functions.found}\` | ${stats.functions.percentage ?? 0}% |
| 📝 **Lines**     | \`${stats.lines.hit} / ${stats.lines.found}\`         | ${stats.lines.percentage ?? 0}%     |
`
}

exports.createComment = async function createComment(stats, { options, context, client }) {
  const body = draftComment(stats, options)

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
