const { Listener } = require('discord-akairo')
const snekfetch = require('snekfetch')
const Logger = require('../../util/Logger')
const Starboard = require('../../struct/Starboard')

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      event: 'ready',
      emitter: 'client',
      category: 'client'
    })
  }

  exec () {
    Logger.info(`${this.client.user.tag} is ready to serve!`)
    this.client.user.setActivity(`Over her ${this.client.users.cache.size} cubs`, { type: 'WATCHING' })

    for (const guild of this.client.guilds.cache.values()) {
      const starboard = new Starboard(guild)
      this.client.starboards.set(guild.id, starboard)
    }

    setInterval(() => {
      this.client.user.setActivity(`Over her ${this.client.users.cache.size} cubs`, { type: 'WATCHING' })
    }, 60000)
  }
}

module.exports = ReadyListener
