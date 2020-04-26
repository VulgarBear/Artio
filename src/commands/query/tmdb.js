const { Command } = require('discord-akairo')
const snekfetch = require('snekfetch')

class tmdbCommand extends Command {
  constructor () {
    super('tmdb', {
      aliases: ['tmdb', 'imdb'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'mediaType',
          type: ['movie', 'series', 'actor'],
          prompt: {
            start: 'Are you searching for a movie ("movie"), televsion show ("series") or Actor ("actor")?',
            retry: 'Please select type movie, series, or actor.'
          }
        },
        {
          id: 'searchTerm',
          match: 'rest',
          prompt: { start: 'What is the name of the movie/series you want to know about?' }
        }
      ],
      description: {
        content: 'Search a Movie, Series, or Actor on TMDB.',
        usage: '[type] [search term]',
        examples: ['movie how to train your dragon']
      }
    })
  }

  async exec (msg, { mediaType, searchTerm }) {
    var string = searchTerm
    var string = string.substring().split(' ')
    const search = string.join('%20')

    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')
    const m = await msg.channel.send(`${loading} **Searching on TMDB...**`)

    const movieURL = 'https://api.themoviedb.org/3/search/movie?api_key=' + process.env.TMDB + '&query=' + search + '&page=1&include_adult=false'
    const seriesURL = 'https://api.themoviedb.org/3/search/tv?api_key=' + process.env.TMDB + '&query=' + search + '&page=1'
    const actorURL = 'https://api.themoviedb.org/3/search/person?api_key=' + process.env.TMDB + '&query=' + search + '&page=1&include_adult=false'

    if (mediaType === 'movie') {
      try {
        var movie = await snekfetch.get(movieURL).then(r => r.body.results[0])
      } catch (e) {
        return m.edit(`${ohNo} I couldn't find that movie.`).then(msg.delete())
      }

      if (movie === undefined) {
        return m.edit(`${ohNo} I couldn't find that movie.`).then(msg.delete())
      }

      const embed = this.client.util.embed()
        .setTitle(movie.title)
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | TMDB API`, `${msg.author.displayAvatarURL()}`)
        .setDescription(movie.overview)
        .setThumbnail('https://image.tmdb.org/t/p/w500' + movie.poster_path)
        .addField('User Rating', `${movie.vote_average}/10`, true)
        .addField('Release Date', movie.release_date, true)
        .addField('More Info', `[TMDB](https://www.themoviedb.org/movie/${movie.id})`)

      m.edit({ embed }).then(msg.delete())
    } else if (mediaType === 'series') {
      try {
        var series = await snekfetch.get(seriesURL).then(r => r.body.results[0])
      } catch (e) {
        return m.edit(`${ohNo} I couldn't find that series.`).then(msg.delete())
      }

      if (series === undefined) {
        return m.edit(`${ohNo} I couldn't find that series.`).then(msg.delete())
      }

      const embed = this.client.util.embed()
        .setTitle(series.name)
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | TMDB API`, `${msg.author.displayAvatarURL()}`)
        .setDescription(series.overview)
        .setThumbnail('https://image.tmdb.org/t/p/w500' + series.poster_path)
        .addField('User Rating', `${series.vote_average}/10`, true)
        .addField('Air Date', series.first_air_date, true)
        .addField('More Info', `[TMDB](https://www.themoviedb.org/tv/${series.id})`)

      m.edit({ embed }).then(msg.delete())
    } else if (mediaType === 'actor') {
      try {
        var actor = await snekfetch.get(actorURL).then(r => r.body.results[0])
      } catch (e) {
        return m.edit(`${ohNo} I couldn't find that game.`).then(msg.delete())
      }

      if (actor === undefined) {
        return m.edit(`${ohNo} I couldn't find that actor.`).then(msg.delete())
      }

      const embed = this.client.util.embed()
        .setTitle(actor.name)
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | TMDB API`, `${msg.author.displayAvatarURL()}`)
        .setThumbnail('https://image.tmdb.org/t/p/w500' + actor.profile_path)
        .addField('Known For', `${actor.known_for[0].title}, ${actor.known_for[1].title}, ${actor.known_for[2].title}`)
        .addField('More Info', `[TMDB](https://www.themoviedb.org/person/${actor.id})`)

      m.edit({ embed }).then(msg.delete())
    } else return m.edit(`${ohNo} Something went wrong I'm sorry.`).then(msg.delete())
  }
}

module.exports = tmdbCommand
