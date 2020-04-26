const { Command } = require('discord-akairo')
const { get } = require('superagent')

class InsultCommand extends Command {
  constructor () {
    super('insult', {
      aliases: ['insult'],
      category: 'fun',
      channel: 'guild',
      cooldown: 3000,
      ratelimit: 2,
      args: [
        {
          id: 'member',
          type: 'user',
          prompt: {
            start: 'Who would you like to insult?',
            retry: 'Please enter a valid user'
          }
        }
      ],
      description: {
        content: 'Insult a user',
        useage: '<prefix>',
        examples: ['@User']
      }
    })
  }

  async exec (msg, { member }) {
    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')

    const m = await msg.channel.send(`${loading} looking for a savage insult!`)

    const { text } = await get('https://evilinsult.com/generate_insult.php?lang=en&type=json')
    if (!text) return msg.util.reply(`${ohNo} There seems to be a problem sorry.`).then(msg.delete())
    const resInsult = JSON.parse(text)
    const insult = resInsult.insult
    const insultRes = insult.toLowerCase()

    m.edit(`${member}, ${insultRes}.`).then(msg.delete())
  }
}
module.exports = InsultCommand
