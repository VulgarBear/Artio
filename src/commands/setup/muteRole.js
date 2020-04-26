const { Command } = require('discord-akairo')

class MuteRoleCommand extends Command {
  constructor () {
    super('muterole', {
      aliases: ['muterole'],
      category: 'setup',
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'roleName',
          type: 'role',
          prompt: {
            start: 'What role would you like to be the mute role?',
            retry: 'Please input a correct role name'
          }
        }
      ],
      description: {
        content: [
          'Configures a role for muted users to be placed into.',
          'Requires a valid role that is already created.'
        ],
        useage: '<prefix>',
        examples: ['@roleName', 'roleName']
      }
    })
  }

  async exec (msg, { roleName }) {
    await this.client.settings.set(msg.guild, 'muteRole', roleName.id)
    return msg.util.reply(`The mute role has been set to ${roleName}`)
  }
}
module.exports = MuteRoleCommand
