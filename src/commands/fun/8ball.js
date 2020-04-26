const { Command } = require('discord-akairo')

class EightBallCommand extends Command {
  constructor () {
    super('8ball', {
      aliases: ['8ball', 'eightball'],
      category: 'fun',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'question',
          match: 'content',
          prompt: {
            start: 'What question would you like to ask the magic eight ball?'
          }
        }
      ],
      description: {
        content: 'Ask the magic 8ball a question.',
        usage: '[question]',
        examples: ['*question*']
      }
    })
  }

  async exec (msg, { question }) {
    const tags = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes',
      'Reply hazy try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', "Don't count on it", 'My reply is no', 'My sources say no', 'Outlook not so good',
      'Very doubtful']
    let thumb = 'https://i.imgur.com/f4LbpDb.png'
    let answer = tags[Math.floor(Math.random() * tags.length)]

    const embed = this.client.util.embed()
      .setAuthor('Magic 8-ball', 'https://just.vulgarity.xyz/a1kTyH4S7GgxTvAN.png')
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('Your Results', [
        `**Question**: ${question}`,
        `**Answer**: ${answer}`
      ])
    msg.channel.send({ embed }).then(msg.delete())
  }
}
module.exports = EightBallCommand
