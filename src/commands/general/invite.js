const { Command } = require('discord-akairo')

class InviteCommand extends Command {
  constructor () {
    super('invite', {
      aliases: ['invite'],
      category: 'general',
      clientPermissions: ['EMBED_LINKS'],
      description: { content: 'Gets the bot invite for Heimdall.' }
    })
  }

  async exec (message) {
    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setDescription(`**[Add Heimdall to your server!](https://discordapp.com/oauth2/authorize/?permissions=536341718&scope=bot&client_id=391050398850613250)**`)

    return message.util.send({ embed })
  }
}

module.exports = InviteCommand
