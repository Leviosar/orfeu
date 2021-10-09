import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice'
import { Message, StageChannel, VoiceChannel, VoiceState } from 'discord.js'
import Youtube from 'ytdl-core'
import YoutubeSearch, { Video } from 'ytsr'
import YoutubePlaylist from 'ytpl'
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
        const voice = message.member.voice.channel

        if (!voice) {
            return message.channel.send("You need to be in a voice channel to play music!")
        }

        if (!args[1]) {
            return message.channel.send("The search string should not be empty.")
        }

        const permissions = voice.permissionsFor(message.client.user)

        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send("I need permissions to join and speak")
        }

        if (Youtube.validateURL(args[1])) /* Direct URL for video */ {
            this.handleURL(message, queues)
        } else if (YoutubePlaylist.validateID(args[1])) /* Direct URL for playlist */ {
            this.handlePlaylistURL(message, queues)
        } else /* Query string for search */ {
            this.handleSearch(message, queues)
        }
    }

    async handleURL(message: Message, queues: Map<string, Queue>) {
        const args = message.content.split(" ")
        const info = await Youtube.getBasicInfo(args[1])
        const song = new Song(info.videoDetails.title, info.videoDetails.video_url)
        
        if (await this.addVideoToPlaylist(message, queues, song)) {
            const queue = queues.get(message.guild.id)

            message.channel.send({
                embeds: [{
                    title: song.title,
                    color: 0,
                    description: `Was added on the queue. (#${queue.songs.length})`
                }]
            })
        }
    }

    async handlePlaylistURL(message: Message, queues: Map<string, Queue>) {
        const args = message.content.split(" ")
        const info = await YoutubePlaylist(args[1], { limit: Infinity })
        
        const songs = info.items.map(item => new Song(item.title, item.url))
        this.addVideoToPlaylist(message, queues, songs)

        message.channel.send({
            embeds: [{
                title: "Playlist added.",
                color: 0,
                description: `${info.items.length} songs were added to the queue`
            }]
        })
    }

    async handleSearch(message: Message, queues: Map<string, Queue>) {
        const args = message.content.split(" ")
        
        args.shift()
        const info = await YoutubeSearch(args.join(), {limit: 1})
        const video: Video = info.items[0] as Video
        const song = new Song(video.title, video.url)

        if (await this.addVideoToPlaylist(message, queues, song)) {
            const queue = queues.get(message.guild.id)

            message.channel.send({
                embeds: [{
                    title: song.title,
                    color: 0,
                    description: `Was added on the queue. (#${queue.songs.length})`
                }]
            })
        }
    }

    async connectToVoice(voice: VoiceChannel) : Promise<VoiceConnection | false> {
        try {
            return joinVoiceChannel({
                channelId: voice.id,
                guildId: voice.guild.id,
                adapterCreator: voice.guild.voiceAdapterCreator
            })
        } catch (err) {
            return false
        }
    }

    async addVideoToPlaylist(message: Message, queues: Map<string, Queue>, song: Song | Song[]) : Promise<Boolean> {
        const voice = message.member.voice.channel as VoiceChannel
        let queue = queues.get(message.guild.id)
        
        if (!queue) {
            queue = new Queue(message)
            queues.set(message.guild.id, queue)
        }

        if (song instanceof Song) {
            queue.songs.push(song)
        } else {
            queue.songs = queue.songs.concat(song)
        }

        if (!queue.connection) {
            let connection = await this.connectToVoice(voice)
            if (connection) {
                queue.connection = connection
                new PlayCommand().run(message, queues)
                return true
            } else {
                queues.delete(message.guild.id)
                message.channel.send("Couldn't join voice channel")
                return false
            }
        }
        return true
    }
}