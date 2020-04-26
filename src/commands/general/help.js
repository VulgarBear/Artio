const { Command } = require('discord-akairo')

class HelpCommand extends Command {
  constructor () {
    super('help', {
      aliases: ['help', 'halp', 'h'],
      category: 'general',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'command',
          type: 'commandAlias',
          prompt: {
            start: 'Which command do you need help with?',
            retry: 'Please provide a valid command.',
            optional: true
          }
        }
      ],
      description: {
        content: 'Displays a list of commands or information about a command.',
        usage: '[command]',
        examples: ['', 'star', 'remove-rep']
      }
    })
  }

  exec (msg, { command }) {
    if (!command) return this.execCommandList(msg)

    const prefix = this.handler.prefix(msg)
    const description = Object.assign({
      content: 'No description available.',
      usage: '',
      examples: [],
      fields: []
    }, command.description)

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTitle(`\`${prefix}${command.aliases[0]} ${description.usage}\``)
      .addField('Description', description.content)

    for (const field of description.fields) embed.addField(field.name, field.value)

    if (description.examples.length) {
      const text = `${prefix}${command.aliases[0]}`
      embed.addField('Examples', `\`${text} ${description.examples.join(`\`\n\`${text} `)}\``, true)
    }

    if (command.aliases.length > 1) {
      embed.addField('Aliases', `\`${command.aliases.join('` `')}\``, true)
    }

    return msg.util.send({ embed }).then(msg.delete())
  }

  async execCommandList (msg) {
    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .addField('Command List',
        [
          'This is a list of commands.',
          'To view details for a command, do `*help <command>`.'
        ])

    for (const category of this.handler.categories.values()) {
      const title = {
        fun: '🤡\u2000Fun',
        general: '📝\u2000General',
        moderation: '🚔\u2000Moderation',
        nsfw: '🔞\u2000NSFW',
        query: '🔍\u2000Query',
        reputation: '💕\u2000Reputation',
        setup: '🛠️\u2000Setup',
        starboard: '⭐\u2000Starboard'
      }[category.id]

      if (title) embed.addField(title, `\`${category.map(cmd => cmd.aliases[0]).join('` `')}\``)
    }

    const shouldReply = msg.guild && msg.channel.permissionsFor(this.client.user).has('SEND_msgS')

    try {
      await msg.author.send({ embed })
      if (shouldReply) return msg.util.reply('I\'ve sent you a DM with the command list.').then(msg.delete())
    } catch (err) {
      if (shouldReply) return msg.util.send({ embed }).then(msg.delete())
    }

    return undefined
  }
}

module.exports = HelpCommand
