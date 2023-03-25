const path = require('node:path')
const fs = require('node:fs')
const core = require('@actions/core')

const lcov = require('./lcov')
const clover = require('./clover')
const { postComment } = require('./post-comment')
const { deleteOldComments } = require('./delete-old-comments')
const { getClient, getOptions } = require('./client')

module.exports = async function run() {
  try {
    const { client, context } = getClient(core.getInput('github-token'))

    const workingDir = core.getInput('working-directory')
    const coverageFile = path.join(workingDir, core.getInput('coverage-file'))
    const shouldDeleteOldComments = core.getInput('delete-old-comments').toLowerCase() === 'true'

    if (!fs.existsSync(coverageFile)) throw new Error('File does not exist. Please check the path of `coverage-file`.')

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
