const core = require('@actions/core')

const REQUESTED_COMMENTS_PER_PAGE = 20

async function getExistingComments({ client, options, context }) {
  let page = 0
  let results = []
  let response

  do {
    response = await client.issues.listComments({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      per_page: REQUESTED_COMMENTS_PER_PAGE,
      page,
    })
    results = results.concat(response.data)
    page++
  } while (response.data.length === REQUESTED_COMMENTS_PER_PAGE)

  return results.filter(
    (comment) =>
      !!comment.user &&
      (!options.title || comment.body.includes(options.title)) &&
      comment.body.includes('Coverage Report'),
  )
}

exports.deleteOldComments = async function deleteOldComments({ client, options, context }) {
  const existingComments = await getExistingComments({ client, options, context })

  for (const comment of existingComments) {
    core.debug(`Deleting comment: ${comment.id}`)

    try {
      await client.issues.deleteComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: comment.id,
      })
    } catch (error) {
      console.error(error)
    }
  }
}
