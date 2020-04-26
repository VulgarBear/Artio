const { Command } = require('discord-akairo')

class AnnounceChannelCommand extends Command {
  constructor () {
    super('announcechannel', {
      aliases: ['announcechannel', 'annchan'],
      category: 'setup',
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'channelName',
          type: 'textChannel',
          prompt: {
            start: 'What channel would you like to send your announcements?',
            retry: 'Please input a correct channel name.'
          }
        }
      ],
      description: {
        content: [
          'Configures the server announcement channel.',
          'Requires a valid channel that is already created.'
        ],
        useage: '<prefix>',
        examples: ['#announcements', 'announcements']
      }
    })
  }

  async exec (msg, { channelName }) {
    await this.client.settings.set(msg.guild.id, 'newsChannel', channelName.id)
    return msg.util.reply(`The announcements channel has been set to ${channelName}`)
  }
}
module.exports = AnnounceChannelCommand
