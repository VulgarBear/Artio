const { Command } = require('discord-akairo')

class DefaultRoleCommand extends Command {
  constructor () {
    super('defaultrole', {
      aliases: ['defaultrole', 'defrole'],
      category: 'setup',
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'roleName',
          type: 'role',
          prompt: {
            start: 'What role would you like to be the default role?',
            retry: 'Please input a correct role name'
          }
        }
      ],
      description: {
        content: [
          'Configures a default role for use with the `accept` command.',
          'Requires a valid role that is already created.'
        ],
        useage: '<prefix>',
        examples: ['@roleName', 'roleName']
      }
    })
  }

  async exec (msg, { roleName }) {
    await this.client.settings.set(msg.guild, 'defaultRole', roleName.id)
    return msg.util.reply(`The default role has been set to ${roleName}`)
  }
}
module.exports = DefaultRoleCommand
