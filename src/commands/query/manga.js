const { Command } = require('discord-akairo')
const Kitsu = require('kitsu.js')
const kitsu = new Kitsu()

class MangaCommand extends Command {
  constructor () {
    super('manga', {
      aliases: ['manga'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'manga',
          match: 'content',
          prompt: {
            start: 'Which manga would you like to search for?',
            retry: 'Please enter a valid search term.'
          }
        }
      ],
      description: {
        content: 'Search for an manga',
        useage: '<prefix>',
        examples: ['[manga title]', 'Cowboy Bebop']
      }
    })
  }

  async exec (msg, { manga }) {
    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')

    const m = await msg.channel.send(`${loading} **Let's see ${manga} huh?**`)

    try {
      var results = await kitsu.searchManga(manga)
    } catch (e) {
      console.log(e)
      return m.edit(`${ohNo} I couldn't find that manga.`).then(msg.delete())
    }
    if (typeof results === 'undefined') return m.edit(`${ohNo} I couldn't find that manga.`).then(msg.delete())

    const url = `https://kitsu.io/manga/${results[0].slug}`

    const embed = this.client.util.embed()
      .setTitle(results[0].titles.canonical)
      .setURL(url)
      .setDescription(`**Synopsis:**\n${results[0].synopsis.substring(0, 450)}...`)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | Kitsu API`, `${msg.author.displayAvatarURL()}`)
      .setThumbnail(results[0].posterImage.small)
      .addField('❯ Volumes', results[0].volumeCount, true)
      .addField('❯ Total Chapers', results[0].chapterCount, true)
      .addField('❯ Rating', `${results[0].averageRating}%`, true)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = MangaCommand
