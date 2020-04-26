const { Command } = require('discord-akairo')
const Kitsu = require('kitsu.js')
const kitsu = new Kitsu()

class AnimeCommand extends Command {
  constructor () {
    super('anime', {
      aliases: ['anime'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'anime',
          match: 'content',
          prompt: {
            start: 'Which anime would you like to search for?',
            retry: 'Please enter a valid search term.'
          }
        }
      ],
      description: {
        content: 'Search for an anime',
        useage: '<prefix>',
        examples: ['[anime title]', 'Cowboy Bebop']
      }
    })
  }

  async exec (msg, { anime }) {
    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')

    const m = await msg.channel.send(`${loading} **Let's see ${anime} huh?**`)

    try {
      var results = await kitsu.searchAnime(anime)
    } catch (e) {
      return m.edit(`${ohNo} I couldn't find that anime.`).then(msg.delete())
    }

    const url = `https://kitsu.io/anime/${results[0].slug}`

    const embed = this.client.util.embed()
      .setTitle(results[0].titles.english + ' | ' + results[0].titles.japanese)
      .setURL(url)
      .setDescription(`**Synopsis:**\n${results[0].synopsis.substring(0, 450)}...`)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | Kitsu API`, `${msg.author.displayAvatarURL()}`)
      .setThumbnail(results[0].posterImage.small)
      .addField('❯ Type', results[0].showType, true)
      .addField('❯ Average Score', `${results[0].averageRating}%`, true)
      .addField('❯ # of Episodes', results[0].episodeCount, true)
      .addField('❯ Duration', results[0].episodeLength + ' mins', true)
      .addField('❯ Content Guide', `${results[0].ageRating} | ${results[0].ageRatingGuide}`)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = AnimeCommand
