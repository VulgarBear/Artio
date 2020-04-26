const { Command } = require('discord-akairo')
const guildSettings = require('../../models/settings')
const ms = require('ms')

class SoftBanCommand extends Command {
  constructor () {
    super('softban', {
      aliases: ['softban', 'sban'],
      category: 'moderation',
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'member',
          type: 'user',
          prompt: {
            start: 'What user would you like to ban?',
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
        content: 'Soft Bans a user from the server.',
        useage: '<prefix>',
        exmaples: ['@User [time] [reason]']
      }
    })
  }

  async exec (msg, { member, time, reason }) {
    msg.guild.members.ban(member.id).catch(console.error)

    const muteTime = ms(time)

    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    if (Object.entries(logChan).length === 0) return msg.util.reply(`${member.tag} has been soft banned.`)
    const logSend = msg.guild.channels.resolve(logChan)

    const guildID = await guildSettings.findOne({ where: { guildID: msg.guild.id } })
    guildID.increment('caseNumber')

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('User Soft Banned', [
        `**User**: ${member.tag}`,
        `**User ID**: ${member.id}`,
        `**Reason**: ${reason}`,
        `**Length**: ${ms(muteTime, { long: true })}`
      ])

    logSend.send({ embed })

    setTimeout(async () => {
      msg.guild.members.unban(member.id).catch(console.error)

      const embed = this.client.util.embed()
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
        .addField('User unbanned', [
        `**User**: ${member.tag}`,
        `**User ID**: ${member.id}`,
        '**Reason**: Automated Softban'
        ])

      logSend.send({ embed })
    }, muteTime)
  }
}
module.exports = SoftBanCommand
