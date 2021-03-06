const { Command } = require('discord-akairo')
const guildSettings = require('../../models/settings')

class KickCommand extends Command {
  constructor () {
    super('kick', {
      aliases: ['kick'],
      category: 'moderation',
      channel: 'guild',
      userPermissions: ['KICK_MEMBERS'],
      args: [
        {
          id: 'member',
          type: 'user',
          prompt: {
            start: 'What user would you like to kick?',
            retry: 'Please enter a valid user.'
          }
        },
        {
          id: 'reason',
          match: 'rest',
          prompt: {
            start: 'What is your reason for kicking this member?',
            retry: 'Please enter a valid reason'
          }
        }
      ],
      description: {
        content: 'Kicks a user from the server.',
        useage: '<prefix>',
        exmaples: ['@User [reason]']
      }
    })
  }

  async exec (msg, { member, reason }) {
    const guildMember = msg.guild.member(member)
    guildMember.kick().catch(console.error)

    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    if (Object.entries(logChan).length === 0) return msg.util.reply(`${member.tag} has been kicked.`)
    const logSend = msg.guild.channels.resolve(logChan)

    const guildID = await guildSettings.findOne({ where: { guildID: msg.guild.id } })
    guildID.increment('caseNumber')

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('User Kicked', [
        `**User**: ${member.tag}`,
        `**User ID**: ${member.id}`,
        `**Reason**: ${reason}`
      ])

    logSend.send({ embed })
  }
}
module.exports = KickCommand
