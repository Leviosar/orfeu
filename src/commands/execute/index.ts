import { joinVoiceChannel } from '@discordjs/voice'
import { Message } from 'discord.js'
import Youtube from 'ytdl-core'
import YoutubeSearch, { Video } from 'ytsr'
import Queue from '../../models/queue.js'
import Song from '../../models/song.js'
import { BaseCommand } from '../base/base-command.js'
import { PlayCommand } from '../play/index.js'

export class ExecuteCommand implements BaseCommand {
    public trigger: string
    public help: string

    constructor() {
        this.trigger = `${process.env.PREFIX}play`
    }

    async run (message: Message, queues: Map<string, Queue>) {
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

        if (Youtube.validateURL(args[1])) {
            const info = await Youtube.getBasicInfo(args[1])
            var song = new Song(info.videoDetails.title, info.videoDetails.video_url)
        } else {
            args.shift()
            const info = await YoutubeSearch(args.join(), {limit: 1})
            const video: Video = info.items[0] as Video
            var song = new Song(video.title, video.url)
        }

        if (!queue) {
            const queue = new Queue(message)
            queue.songs.push(song)
            queues.set(message.guild.id, queue)

            try {
                queue.connection = await joinVoiceChannel({
                    channelId: voice.id,
                    guildId: voice.guild.id,
                    adapterCreator: voice.guild.voiceAdapterCreator
                })

                new PlayCommand().run(message, queues)
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