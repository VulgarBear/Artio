const { Command } = require('discord-akairo')

class AnnouncementCommand extends Command {
  constructor () {
    super('announcement', {
      aliases: ['news', 'annc', 'announcement'],
      category: 'moderation',
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'title',
          prompt: {
            start: 'What would you like to title your announcement?',
            retry: 'Please enter a valid title.'
          }
        },
        {
          id: 'content',
          match: 'rest',
          prompt: {
            start: 'What is your message? (1024 character max)',
            retry: 'Please enter a valid message.'
          }
        }
      ],
      description: {
        content: 'Create an announcement, recommended that you follow the prompts.',
        useage: '<prefix>',
        examples: ['[title] [content]', '*Follow the prompts*']
      }
    })
  }

  async exec (msg, { title, content }) {
    const anncChan = this.client.settings.get(msg.guild.id, 'newsChannel', [])
    if (Object.entries(anncChan).length === 0) return msg.util.reply(`No announcements channel congifured please run **${this.handler.prefix(msg)}annchan**`)
    const anncSend = msg.guild.channels.resolve(anncChan)

    const embed = this.client.util.embed()
      .setTitle(title)
      .setDescription(content)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`By ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)

    anncSend.send({ embed })
  }
}
module.exports = AnnouncementCommand
