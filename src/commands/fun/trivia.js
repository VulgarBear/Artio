const { Command } = require('discord-akairo')
const { get } = require('superagent')
const shuffle = require('shuffle-array')
const he = require('he')

class TriviaCommand extends Command {
  constructor () {
    super('trivia', {
      aliases: ['trivia'],
      category: 'fun',
      cooldown: 5000,
      ratelimit: 1,
      args: [
        {
          id: 'category',
          type: ['games', 'animals', 'general', 'movies', 'jp_animation', 'animation', 'music'],
          prompt: {
            start: 'Trivia based on animals, games, or general.',
            retry: 'Please enter a valid category.'
          }
        }
      ],
      description: {
        content: 'Play trivia based on multiple categories.',
        useage: '<prefix>',
        examples: ['games', 'animals', 'movies', 'jp_animation', 'animation', 'music', 'general']
      }
    })
  }

  async exec (msg, { category }) {
    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')
    const check = await this.client.emojis.resolve('541151462642941962')
    const sent = await msg.channel.send(`${loading} **Grabbing your trivia...**`)

    if (category === 'games') {
      var { body } = await get('https://opentdb.com/api.php?amount=1&category=15&type=multiple')
    } else if (category === 'animals') {
      var { body } = await get('https://opentdb.com/api.php?amount=1&category=27&type=multiple')
    } else if (category === 'movies') {
      var { body } = await get('https://opentdb.com/api.php?amount=1&category=11&type=multiple')
    } else if (category === 'jp_animation') {
      var { body } = await get('https://opentdb.com/api.php?amount=1&category=31&type=multiple')
    } else if (category === 'animation') {
      var { body } = await get('https://opentdb.com/api.php?amount=1&category=32&type=multiple')
    } else if (category === 'music') {
      var { body } = await get('https://opentdb.com/api.php?amount=1&category=12&type=multiple')
    } else if (category === 'general') {
      var { body } = await get('https://opentdb.com/api.php?amount=1&category=9&type=multiple')
    } else {
      return sent.edit(`${ohNo} I couldn't find any trivia.`).then(msg.delete())
    }

    if (!body.results[0].question) return sent.edit(`${ohNo} I couldn't find any trivia.`).then(msg.delete())
    const results = body.results[0]

    const question = results.question

    var answers = [he.decode(results.correct_answer), he.decode(results.incorrect_answers[0]), he.decode(results.incorrect_answers[1]), he.decode(results.incorrect_answers[2])]

    shuffle(answers)

    const embed = this.client.util.embed()
      .setTitle(results.category)
      .setDescription('Please select the correct answer via 1-4')
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | OpenTDB API`, `${msg.author.displayAvatarURL()}`)
      .addField('Question:', he.decode(question))
      .addField('Answers:', [
        `1: ${(answers[0])}`,
        `2: ${answers[1]}`,
        `3: ${answers[2]}`,
        `4: ${answers[3]}`
      ])

    await sent.edit({ embed }).then(msg.delete())
    const filter = m => m.author.id === msg.author.id
    const attempts = await msg.channel.awaitMessages(filter, { time: 15000, max: 1 })

    if (!attempts || !attempts.size) {
      await sent.edit({ embed: null })
      return msg.channel.send(`${ohNo} You ran out of time it was **${he.decode(results.correct_answer)}**.`)
    }

    const answer = attempts.first().content.toLowerCase()
    const index = Number(answer) - 1

    if (answers[index].toLowerCase() === he.decode(results.correct_answer.toLowerCase())) {
      await sent.edit({ embed: null })
      return msg.channel.send(`${check} You answered correctly with **${he.decode(results.correct_answer)}**`)
    } else {
      await sent.edit({ embed: null })
      return msg.channel.send(`${ohNo} You answered incorrectly, It was **${he.decode(results.correct_answer)}**`)
    }
  }
}
module.exports = TriviaCommand
