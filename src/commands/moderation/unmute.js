const { Command } = require('discord-akairo')
const guildSettings = require('../../models/settings')
const ms = require('ms')

class UnmuteCommand extends Command {
  constructor () {
    super('unmute', {
      aliases: ['unmute'],
      category: 'moderation',
      channel: 'guild',
      userPermissions: ['KICK_MEMBERS'],
      args: [
        {
          id: 'member',
          type: 'user',
          prompt: {
            start: 'What user would you like to mute?',
            retry: 'Please enter a valid user.'
          }
        },
        {
          id: 'reason',
          match: 'rest',
          prompt: {
            start: 'What is your reason for unmuting this member?',
            retry: 'Please enter a valid reason'
          }
        }
      ],
      description: {
        content: 'Unmutes a user on the server.',
        useage: '<prefix>',
        exmaples: ['@User [reason] [time]']
      }
    })
  }

  async exec (msg, { member, time, reason }) {
    const muteRole = this.client.settings.get(msg.guild.id, 'muteRole', [])
    if (!muteRole) return msg.util.reply('💢 Muting is not configured on this server.')
    const guildMember = msg.guild.member(member)

    if (!guildMember.roles.cache.has(muteRole)) return msg.util.reply('💢 User is not currently muted.')

    guildMember.roles.remove(muteRole).catch(console.error)

    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    if (Object.entries(logChan).length === 0) return msg.util.reply(`${member.tag} has been soft banned.`)
    const logSend = msg.guild.channels.resolve(logChan)

    const guildID = await guildSettings.findOne({ where: { guildID: msg.guild.id } })
    guildID.increment('caseNumber')

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('User Unmuted', [
        `**User**: ${member.tag}`,
        `**User ID**: ${member.id}`,
        `**Reason**: ${reason}`
      ])

    logSend.send({ embed })
  }
}
module.exports = UnmuteCommand
