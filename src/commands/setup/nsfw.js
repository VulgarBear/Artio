const { Command } = require('discord-akairo')

class NSFWCommand extends Command {
  constructor () {
    super('nsfw', {
      aliases: ['nsfw'],
      category: 'setup',
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'yesOrNo',
          type: /^(true|false)$/i,
          prompt: {
            start: 'Would you like to enable nsfw mode true/false?',
            retry: 'Please either input either true or false.'
          }
        }
      ],
      description: {
        content: [
          'Enables or disables NSFW mode.',
          'Must select either true or false.'
        ],
        usage: '<prefix>',
        examples: ['true', 'false']
      }
    })
  }

  async exec (msg, { yesOrNo }) {
    if (yesOrNo.match[0] === 'true') {
      await this.client.settings.set(msg.guild, 'nsfw', true)
      return msg.util.reply('NSFW has been to **TRUE** for you server.')
    } else {
      await this.client.settings.set(msg.guild, 'nsfw', false)
      return msg.util.reply('NSFW has been to **FALSE** for you server.')
    }
  }
}
module.exports = NSFWCommand
