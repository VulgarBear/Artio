const { Command } = require('discord-akairo')

class AboutCommand extends Command {
  constructor () {
    super('about', {
      aliases: ['about', 'info'],
      category: 'general',
      clientPermissions: ['EMBED_LINKS'],
      description: { content: 'Shows information about Heimdall.' }
    })
  }

  exec (message) {
    const prefix = this.handler.prefix(message)
    const asgard = this.client.users.resolve('101808227385098240')

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTitle('About Heimdallr')
      .setDescription([
        `Artio is developed by **${asgard}** and is a private build of my bot Heimdallr. Artio was made specifically for this server. All out-going links relating to this bot will lead to Heimdallr resrouces.`,
        '',
        'You can find out more on the **[github](https://github.com/VulgarBear/heimdall)**.',
        '',
        `Use \`${prefix}stats\` for statistics and \`${prefix}invite\` for an invite link.`,
        '',
        'Join the community server [server](https://discord.gg/E9cJjvw) to learn more!'
      ])

    return message.util.send({ embed })
  }
}

module.exports = AboutCommand
