const { Command } = require('discord-akairo')
const superagent = require('superagent')

class DatbuttCommand extends Command {
  constructor () {
    super('datbutt', {
      aliases: ['datbutt', 'dabutt'],
      category: 'hidden',
      cooldown: 5000,
      ratelimit: 1,
      description: { content: 'The forbidden command.' }
    })
  }

  async exec (msg) {
    const response = ['Just who the fuck do you think you are?', 'That\'s disgusting', 'haha and then what :wink:', 'I bet you say that to all the girls.', 'We are never ever getting back together!!!', 'Seriously, we barely know each other.', ':middle_finger: Sit on it and spin bitch!', 'Umm... I have a boyfriend.']

    if ((msg.author.id == 137727774910709760) == false) return msg.channel.send(response[Math.floor(Math.random() * response.length)]).then(msg.delete())

    const loading = await this.client.emojis.resolve('620109183399755796')
    const ohNo = await this.client.emojis.resolve('620106037390999558')
    const m = await msg.channel.send(`${loading} **Hold onto your butts!**`)

    try {
      var image = await superagent.get('https://api.imgur.com/3/album/JZUQ7/images').set('authorization', 'Client-ID ' + process.env.IMGUR).then(r => r.body)
    } catch (e) {
      return m.edit(`${ohNo} Looks like something went wrong.`).then(msg.delete())
    }

    if (image.status == 403) {
      return m.edit(`${ohNo} Looks like something went wrong.`).then(msg.delete())
    }

    var i = Math.floor(Math.random() * image.data.length)

    if (image.data[i].is_album === true) {
      var imagePhoto = image.data[i].images[0].link
    } else {
      var imagePhoto = image.data[i].link
    }

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(imagePhoto)
      .setColor(process.env.EMBED)
      .setImage(imagePhoto)
      .setFooter('Requested by REDACTED | via REDACTED • REDATED at XX:XX GMT', 'https://just.vulgarity.xyz/CWtyugHIu6oVFuYN.png')

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = DatbuttCommand
