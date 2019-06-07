'use strict'
const api = require('../../lib/connect/api.js')
const cli = require('heroku-cli-util')
const co = require('co')

module.exports = {
  topic: 'connect-events:stream',
  command: 'add',
  description: 'Add a stream',
  help: 'Add a stream',
  args: [
    {name: 'stream'}
  ],
  flags: [
    {name: 'resource', description: 'specific connection resource name', hasValue: true}
  ],
  needsApp: true,
  needsAuth: true,
  run: cli.command(co.wrap(function * (context, heroku) {
    yield cli.action('adding stream', co(function * () {
      let connection = yield api.withConnection(context, heroku, api.ADDON_TYPE_EVENTS)
      context.region = connection.region_url
      let response = yield api.request(
        context, 'POST', `/api/v3/kafka-connections/${connection.id}/streams`,
        {'object_name': context.args.stream}
      )
      if (response.status !== 201) {
        throw new Error(response.data.message || 'unknown error')
      }
    }))
  }))
}
