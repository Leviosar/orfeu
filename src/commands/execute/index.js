import Youtube from 'ytdl-core'
import YoutubeSearch from 'ytsr'
import PlayCommand from '../play'

export default class ExecuteCommand {
    
    static trigger = `${process.env.prefix}play`

    static async run (message, queues) {
        const args = message.content.split(' ')
        const queue = queues.get(message.guild.id)
        const voice = message.member.voice.channel

        if (!voice) {
            return message.channel.send("You need to be in a voice channel to play music!")
        }

        const permissions = voice.permissionsFor(message.client.user)

        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send("I need permissions to join and speak")
        }

        const song = {}

        if (Youtube.validateURL(args[1])) {
            const info = await Youtube.getBasicInfo(args[1])
            
            song.title = info.videoDetails.title,
            song.url = info.videoDetails.video_url
        } else {
            args.shift()
            const info = await YoutubeSearch(args.join(), {limit: 1})

            if (info.items[0].title) {
                song.title = info.items[0].title
                song.url = info.items[0].url
            } else {
                return message.channel.send("Couldn't find video")
            }
        }

        if (!queue) {
            const contract = {
                id: message.guild.id,
                text: message.channel,
                voice: message.member.voice.channel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            }

            queues.set(message.guild.id, contract)
            contract.songs.push(song)

            try {
                contract.connection = await voice.join()
                PlayCommand.run(message, queues)
            } catch (err) {
                queues.delete(message.guild.id)
                return message.channel.send("Couldn't join voice channel")
            }
        } else {
            queue.songs.push(song)
            return message.channel.send(`${song.title} has been added to the queue!`)
        }
    }

}