import { AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, NoSubscriberBehavior, StreamType } from '@discordjs/voice'
import { Message } from 'discord.js'
import Youtube from 'ytdl-core'
import Queue from '../../models/queue'

export class PlayCommand {
    
    async run (message: Message, queues: Map<string, Queue>) {
        const queue = queues.get(message.guild.id)
        const song = queue.songs[0]

        if (!song) return queues.delete(queue.id)

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
            new PlayCommand().run(message, queues)
        })
        
        player.on("error", err => console.log(err))
        
        player.play(resource)

        queue.text.send(`Start playing: **${song.title}**`)

        return await entersState(player, AudioPlayerStatus.Playing, 5000)
    }

}