const { Command } = require('discord-akairo')
const fetch = require('node-fetch')

class CheapSharkCommand extends Command {
  constructor () {
    super('cheapshark', {
      aliases: ['cheapshark', 'cs'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'searchTerm',
          match: 'content',
          prompt: {
            start: 'What game would you like to check sales on?',
            retry: 'Please enter a valid game name.'
          }
        }
      ],
      description: {
        content: 'Searches game sales via cheapshark',
        useage: '<prefix>',
        examples: ['cheapshark [game name]', 'cs skyrim']
      }
    })
  }

  async exec (msg, { searchTerm }) {
    const search = searchTerm.split(' ').join('+')
    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')

    const m = await msg.channel.send(`${loading} **Searching on Cheapshark...**`)

    const stores = await fetch('http://www.cheapshark.com/api/1.0/stores').then(res => res.json())
    const res = await fetch('http://www.cheapshark.com/api/1.0/deals?lowerPrice&title=' + search + '&pageSize=2').then(res => res.json())
    if (!res[0]) return m.edit(`${ohNo} I couldn't find that game.`).then(msg.delete())

    const embed = this.client.util.embed()
      .setTitle(res[0].title)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | Cheapshark API`, `${msg.author.displayAvatarURL()}`)
      .setThumbnail(res[0].thumb)
      .addField('Store Name', stores[res[0].storeID - 1].storeName, true)
      .addField('Store Link', `[Click Here](https://www.cheapshark.com/redirect.php?dealID=${res[0].dealID})`, true)
      .addField('Sale Price', res[0].salePrice, true)
      .addField('Normal Price', res[0].normalPrice, true)
      .addField('Savings', `${res[0].savings.substring(0, 2)}%`, true)
      .addField('Deal Rating', res[0].dealRating, true)
      .addField('Steam Rating', res[0].steamRatingText, true)
      .addField('MetaCritic Score', res[0].metacriticScore, true)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = CheapSharkCommand
