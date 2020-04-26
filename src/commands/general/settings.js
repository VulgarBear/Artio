const { Command } = require('discord-akairo')
const Starboard = require('../../struct/Starboard')

class SettingsCommand extends Command {
  constructor () {
    super('settings', {
      aliases: ['settings', 'view-settings'],
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: { content: 'Displays the guild\'s current settings.' }
    })
  }

  exec (msg) {
    const prefix = this.handler.prefix(msg)
    const defaultRole = this.client.settings.get(msg.guild.id, 'defaultRole', [])
    const muteRole = this.client.settings.get(msg.guild.id, 'muteRole', [])
    const emojiID = this.client.settings.get(msg.guild, 'emoji', '⭐')
    const starboard = this.client.starboards.get(msg.guild.id)
    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    const newsChan = this.client.settings.get(msg.guild.id, 'newsChannel', [])
    const blacklist = this.client.settings.get(msg.guild, 'blacklist', [])
    const nsfw = this.client.settings.get(msg.guild, 'nsfw', [])

    const logName = msg.guild.channels.resolve(logChan)
    const newsName = msg.guild.channels.resolve(newsChan)
    const defRoleName = msg.guild.roles.resolve(defaultRole)
    const muteRoleName = msg.guild.roles.resolve(muteRole)

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTitle('Settings')
      .setDescription([
        `**Prefix**: \`${prefix}\``,
        `**Default Role:** ${(defRoleName) || 'None'}`,
        `**Mute Role:** ${(muteRoleName) || 'None'}`,
        `**Log Channel**: ${(logName) || 'None'}`,
        `**Annoucement Channel**: ${(newsName) || 'None'}`,
        `**Emoji**: ${Starboard.emojiFromID(this.client, emojiID)}`,
        `**Starboard**: ${(starboard && starboard.channel) || 'None'}`,
        `**Threshold**: ${(starboard && starboard.threshold) || 'None'}`,
        `**Blacklist**: ${blacklist.join(', ') || 'None'}`,
        `**NSFW Mode**: \`${nsfw}\``
      ])
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)

    return msg.util.send({ embed })
  }
}

module.exports = SettingsCommand
