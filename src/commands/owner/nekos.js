const { Command } = require('discord-akairo')
const { get } = require('snekfetch')

class NekosCommand extends Command {
  constructor () {
    super('nekos', {
      aliases: ['nekos'],
      category: 'nsfw',
      ownerOnly: true
    })
  }

  async exec (msg) {
    console.log(this.client.guilds.values())
  }
}
module.exports = NekosCommand
