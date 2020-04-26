const { Command } = require('discord-akairo')
const guildSettings = require('../../models/settings')
const ms = require('ms')

class MuteCommand extends Command {
  constructor () {
    super('mute', {
      aliases: ['mute'],
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
          id: 'time',
          prompt: {
            start: 'How long should the user be muted? (h, m, s)',
            retry: 'Please enter a valid time'
          }
        },
        {
          id: 'reason',
          match: 'rest',
          prompt: {
            start: 'What is your reason for banning this member?',
            retry: 'Please enter a valid reason'
          }
        }
      ],
      description: {
        content: 'Mutes a user on the server.',
        useage: '<prefix>',
        exmaples: ['@User [time] [reason]']
      }
    })
  }

  async exec (msg, { member, time, reason }) {
    const muteRole = this.client.settings.get(msg.guild.id, 'muteRole', [])
    if (!muteRole) return msg.util.reply('💢 Muting is not configured on this server.')
    const guildMember = msg.guild.member(member)

    const muteTime = ms(time)

    if (typeof muteTime === 'undefined') return msg.util.reply('Please enter your time like `2h` using h, m, or s')

    if (guildMember.roles.cache.has(muteRole)) return msg.util.reply('💢 User is already muted.')

    guildMember.roles.add(muteRole).catch(console.error)

    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    if (Object.entries(logChan).length === 0) return msg.util.reply(`${member.tag} has been soft banned.`)
    const logSend = msg.guild.channels.resolve(logChan)

    const guildID = await guildSettings.findOne({ where: { guildID: msg.guild.id } })
    guildID.increment('caseNumber')

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('User Muted', [
        `**User**: ${member.tag}`,
        `**User ID**: ${member.id}`,
        `**Reason**: ${reason}`,
        `**Length**: ${ms(muteTime, { long: true })}`
      ])

    logSend.send({ embed })

    setTimeout(async () => {
      await guildMember.roles.remove(muteRole)

      const embed = this.client.util.embed()
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
        .addField('User Unmuted', [
        `**User**: ${member.tag}`,
        `**User ID**: ${member.id}`,
        '**Reason**: Automated unmute'
        ])

      logSend.send({ embed })
    }, muteTime)
  }
}
module.exports = MuteCommand
