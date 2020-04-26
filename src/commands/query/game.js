const { Command } = require('discord-akairo')
const igdb = require('igdb-api-node').default

class GameCommand extends Command {
  constructor () {
    super('game', {
      aliases: ['game', 'igdb'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'game',
          match: 'content',
          prompt: { start: 'Which game would you like to lookup?' }
        }
      ],
      description: {
        content: 'Search a game on IGDB',
        usage: '[game name]',
        examples: ['Fortnite']
      }
    })
  }

  async exec (msg, { game }) {
    const API = igdb(`${process.env.IGDB}`)
    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')

    const m = await msg.channel.send(`${loading} **Checking IGDB for ${game}**`)
    game.split(' ').join('+')

    const res = await igdb(process.env.IGDB)
      .fields('name,rating,summary,url,cover')
      .limit(1)
      .search(game)
      .request('/games')

    if (!res.data[0].summary) return m.edit(`${ohNo} I couldn't find that game.`).then(msg.delete())

    const gameSummary = res.data[0].summary

    const embed = this.client.util.embed()
      .setTitle(res.data[0].name)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | IGDB API`, `${msg.author.displayAvatarURL()}`)
      .addField('Summary', `${gameSummary.substring(0, 350)}...`)
      .addField('Ratings', `${Math.round(res.data[0].rating)}%`, true)
      .addField('More Info', `[IGDB Results](${res.data[0].url})`, true)

    m.edit({ embed }).then(msg.delete())
  }
}

module.exports = GameCommand
