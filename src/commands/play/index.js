import Youtube from 'ytdl-core'

export default class PlayCommand {

    static run (message, queues) {
        const queue = queues.get(message.guild.id)
        const song = queue.songs[0]

        if (!song) {
            queues.delete(queue.id)
            return
        }

        const dispatcher = queue.connection.play(Youtube(song.url))
            .on("finish", () => {
                queue.songs.shift()
                PlayCommand.run(message, queues)
            })
            .on("error", err => console.log(err))

        dispatcher.setVolumeLogarithmic(queue.volume / 5)
        queue.text.send(`Start playing: **${song.title}**`)
    }

}