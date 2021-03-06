const { Command } = require('discord-akairo')
const guildSettings = require('../../models/settings')

class RoleAddCommand extends Command {
  constructor () {
    super('roleadd', {
      aliases: ['roleadd', 'addrole'],
      category: 'moderation',
      channel: 'guild',
      userPermissions: ['MANAGE_ROLES'],
      args: [
        {
          id: 'member',
          type: 'user',
          prompt: {
            start: 'What user would you like to add to a role?',
            retry: 'Please enter a valid user.'
          }
        },
        {
          id: 'role',
          type: 'role',
          prompt: {
            start: 'Which role would you like to add?',
            retry: 'Please enter a valid role.'
          }
        }
      ],
      description: {
        content: 'Add a user to a server role.',
        useage: '<prefix>',
        exmaples: ['@User @Role', '@User [Role]']
      }
    })
  }

  async exec (msg, { member, role }) {
    const guildRole = msg.guild.roles.resolve(role.id)
    const guildMember = msg.guild.member(member)
    if (!guildRole) return msg.util.reply(`The role **${role}** cannot be found.`)
    guildMember.roles.add(guildRole.id).catch(console.error)

    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    if (Object.entries(logChan).length === 0) return msg.util.reply(`${member.tag} has had role added.`)
    const logSend = msg.guild.channels.resolve(logChan)

    const guildID = await guildSettings.findOne({ where: { guildID: msg.guild.id } })
    guildID.increment('caseNumber')

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('User Role Added', [
        `**User**: ${member.tag}`,
        `**Role**: ${role}`
      ])

    logSend.send({ embed })
  }
}
module.exports = RoleAddCommand
