const Akairo = require('discord-akairo')
const { Command } = Akairo
const Discord = require('discord.js')
const Star = require('../../models/stars')

class StatsCommand extends Command {
  constructor () {
    super('stats', {
      aliases: ['stats'],
      category: 'general',
      clientPermissions: ['EMBED_LINKS'],
      description: { content: 'Displays Heimdall\'s statistics.' }
    })
  }

  formatMilliseconds (ms) {
    let x = Math.floor(ms / 1000)
    let seconds = x % 60

    x = Math.floor(x / 60)
    let minutes = x % 60

    x = Math.floor(x / 60)
    let hours = x % 24

    let days = Math.floor(x / 24)

    seconds = `${'0'.repeat(2 - seconds.toString().length)}${seconds}`
    minutes = `${'0'.repeat(2 - minutes.toString().length)}${minutes}`
    hours = `${'0'.repeat(2 - hours.toString().length)}${hours}`
    days = `${'0'.repeat(Math.max(0, 2 - days.toString().length))}${days}`

    return `${days === '00' ? '' : `${days}:`}${hours}:${minutes}:${seconds}`
  }

  async exec (message) {
    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTitle('Artio Statistics')
      .addField('Discord', [
        `**Guilds**: ${this.client.guilds.cache.size}`,
        `**Channels**: ${this.client.channels.cache.size}`,
        `**Users**: ${this.client.users.cache.size}`,
        `**Stars**: ${await Star.count()}`
      ], true)
      .addField('Technical', [
        `**Uptime**: ${this.formatMilliseconds(this.client.uptime)}`,
        `**Memory**: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        `**Discord.js**: v${Discord.version}`,
        `**Akairo**: v${Akairo.version}`
      ], true)

    return message.util.send({ embed })
  }
}

module.exports = StatsCommand
