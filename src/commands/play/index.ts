import { AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, NoSubscriberBehavior, StreamType } from '@discordjs/voice'
import { Message } from 'discord.js'
import Youtube from 'ytdl-core'
import Log from '../../logger/index.js'
import Queue from '../../models/queue'

export class PlayCommand {
    static timeout: NodeJS.Timeout

    async run (message: Message, queues: Map<string, Queue>) {
        try {
            const queue = queues.get(message.guild.id)
            const song = queue.songs[0]
            
            if (!song) return queues.delete(queue.id)

            clearTimeout(PlayCommand.timeout)
    
            const stream = Youtube(song.url, {filter: "audioonly"})
    
            const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary })
    
            resource.volume?.setVolumeLogarithmic(queue.volume / 5)
    
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            })
    
            queue.player = player
    
            queue.connection.subscribe(player)
    
            player.on(AudioPlayerStatus.Idle, () => {
                queue.songs.shift()
                
                PlayCommand.timeout = setTimeout(() => {
                    queue.text.send("Câmbio, desligo")
                    queue.connection.destroy()
                }, 1000 * 60 * 2)

                new PlayCommand().run(message, queues)
            })
            
            player.on("error", err => Log.error(err.message))
            
            player.play(resource)
    
            queue.text.send(`Start playing: **${song.title}**`)
    
            return await entersState(player, AudioPlayerStatus.Playing, 5000)
        } catch (error) {
            message.channel.send("Caguei nas calça.")
            Log.error(error)            
        }
    }

}