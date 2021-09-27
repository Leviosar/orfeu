import { AudioPlayerStatus, createAudioPlayer, createAudioResource, StreamType } from '@discordjs/voice'
import { Message } from 'discord.js'
import Youtube from 'ytdl-core'
import Queue from '../../models/queue'

export class PlayCommand {
    
    run (message: Message, queues: Map<string, Queue>) {
        const queue = queues.get(message.guild.id)
        const song = queue.songs[0]

        if (!song) return queues.delete(queue.id)

        const stream = Youtube(song.url, {filter: "audioonly"})
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary })
        const player = createAudioPlayer()

        queue.player = player
        
        player.play(resource)

        player.on(AudioPlayerStatus.Idle, () => {
            queue.songs.shift()
            new PlayCommand().run(message, queues)
        })

        player.on("error", err => console.log(err))
        
        queue.text.send(`Start playing: **${song.title}**`)
    }

}