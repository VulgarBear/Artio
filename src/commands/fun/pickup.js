const { Command } = require('discord-akairo')
const { get } = require('superagent')

class PickupCommand extends Command {
  constructor () {
    super('pickup', {
      aliases: ['pickup'],
      category: 'fun',
      channel: 'guild',
      cooldown: 3000,
      ratelimit: 2,
      args: [
        {
          id: 'member',
          type: 'user',
          prompt: {
            start: 'Who would you like to pickup?',
            retry: 'Please enter a valid user'
          }
        }
      ],
      description: {
        content: 'Generate a pickup for a user',
        useage: '<prefix>',
        examples: ['@User']
      }
    })
  }

  async exec (msg, { member }) {
    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')

    const m = await msg.channel.send(`${loading} looking for an awesome pickup line!`)

    const { body } = await get('https://pebble-pickup.herokuapp.com/tweets/random')
    if (!body) return msg.util.reply(`${ohNo} There seems to be a problem sorry.`).then(msg.delete())
    const pickup = body.tweet.toLowerCase()

    m.edit(`${member}, ${pickup}.`).then(msg.delete())
  }
}
module.exports = PickupCommand
