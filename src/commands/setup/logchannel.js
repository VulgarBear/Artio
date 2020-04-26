const { Command } = require('discord-akairo')

class LogChannelCommand extends Command {
  constructor () {
    super('logchannel', {
      aliases: ['logchannel', 'logchan'],
      category: 'setup',
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'channelName',
          type: 'textChannel',
          prompt: {
            start: 'What channel would you like to be your server log?',
            retry: 'Please input a correct channel name.'
          }
        }
      ],
      description: {
        content: [
          'Configures the server log channel.',
          'Requires valid channel that is already created.'
        ],
        useage: '<prefix>',
        examples: ['#log-channel', 'log-channel']
      }
    })
  }

  async exec (msg, { channelName }) {
    await this.client.settings.set(msg.guild, 'logChannel', channelName.id)
    return msg.util.reply(`The log channel has been set to **${channelName}**.`)
  }
}
module.exports = LogChannelCommand
