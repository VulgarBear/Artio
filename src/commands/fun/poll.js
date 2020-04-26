const { Command } = require('discord-akairo')

class PollCommand extends Command {
  constructor () {
    super('poll', {
      aliases: ['poll'],
      category: 'fun',
      cooldown: 5000,
      ratelimit: 1,
      description: { content: ['Create a poll.'] },
      args: [
        {
          id: 'question',
          match: 'content',
          prompt: {
            start: 'What would you like to poll on?'
          }
        }
      ]
    })
  }

  async exec (msg, { question }) {
    const goodEmoji = await this.client.emojis.resolve('541151462642941962')
    const badEmoji = await this.client.emojis.resolve('541151482599440385')

    const embed = this.client.util.embed()
      .setTitle('Server Poll | React to Vote')
      .setColor(process.env.EMBED)
      .setDescription(question)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)

    const m = await msg.channel.send({ embed }).then(function (m) {
      m.react(goodEmoji.id)
      m.react(badEmoji.id)
      msg.delete()
    })
  }
}
module.exports = PollCommand
