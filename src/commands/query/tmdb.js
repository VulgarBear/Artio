const { Command } = require('discord-akairo')
const fetch = require('node-fetch')

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
        var movie = await fetch(movieURL).then(res => res.json())
      } catch (e) {
        return m.edit(`${ohNo} I couldn't find that movie.`).then(msg.delete()).then(console.log(e))
      }

      if (movie.results[0] === undefined) {
        return m.edit(`${ohNo} I couldn't find that movie.`).then(msg.delete())
      }

      const embed = this.client.util.embed()
        .setTitle(movie.results[0].title)
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | TMDB API`, `${msg.author.displayAvatarURL()}`)
        .setDescription(movie.results[0].overview)
        .setThumbnail('https://image.tmdb.org/t/p/w500' + movie.results[0].poster_path)
        .addField('User Rating', `${movie.results[0].vote_average}/10`, true)
        .addField('Release Date', movie.results[0].release_date, true)
        .addField('More Info', `[TMDB](https://www.themoviedb.org/movie/${movie.results[0].id})`)

      m.edit({ embed }).then(msg.delete())
    } else if (mediaType === 'series') {
      try {
        var series = await fetch(seriesURL).then(res => res.json())
      } catch (e) {
        return m.edit(`${ohNo} I couldn't find that series.`).then(msg.delete())
      }

      if (series.results[0] === undefined) {
        return m.edit(`${ohNo} I couldn't find that series.`).then(msg.delete())
      }

      const embed = this.client.util.embed()
        .setTitle(series.results[0].name)
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | TMDB API`, `${msg.author.displayAvatarURL()}`)
        .setDescription(series.results[0].overview)
        .setThumbnail('https://image.tmdb.org/t/p/w500' + series.results[0].poster_path)
        .addField('User Rating', `${series.results[0].vote_average}/10`, true)
        .addField('Air Date', series.results[0].first_air_date, true)
        .addField('More Info', `[TMDB](https://www.themoviedb.org/tv/${series.results[0].id})`)

      m.edit({ embed }).then(msg.delete())
    } else if (mediaType === 'actor') {
      try {
        var actor = await fetch(actorURL).then(res => res.json())
      } catch (e) {
        return m.edit(`${ohNo} I couldn't find that actor.`).then(msg.delete())
      }

      if (actor.results[0] === undefined) {
        return m.edit(`${ohNo} I couldn't find that actor.`).then(msg.delete())
      }

      const embed = this.client.util.embed()
        .setTitle(actor.results[0].name)
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | TMDB API`, `${msg.author.displayAvatarURL()}`)
        .setThumbnail('https://image.tmdb.org/t/p/w500' + actor.results[0].profile_path)
        .addField('Known For', `${actor.results[0].known_for[0].title}, ${actor.results[0].known_for[1].title}, ${actor.results[0].known_for[2].title}`)
        .addField('More Info', `[TMDB](https://www.themoviedb.org/person/${actor.results[0].id})`)

      m.edit({ embed }).then(msg.delete())
    } else return m.edit(`${ohNo} Something went wrong I'm sorry.`).then(msg.delete())
  }
}

module.exports = tmdbCommand
