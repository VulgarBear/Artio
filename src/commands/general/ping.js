const { Command } = require('discord-akairo')

class PingCommand extends Command {
  constructor () {
    super('ping', {
      aliases: ['ping'],
      category: 'general',
      description: { content: 'Pings Bjorn.' }
    })
  }

  async exec (msg) {
    let start = Date.now(); msg.channel.send(msg.channel.id, 'Thinking...').then(m => {
      let diff = (Date.now() - start)

      const embed = this.client.util.embed()
        .setTitle('🔔 Pong!')
        .setColor(process.env.EMBED)
        .addField('📶 Latency', `${diff}ms`, true)

      m.delete().then(msg.channel.send({ embed }))
    })
  }
}

module.exports = PingCommand
