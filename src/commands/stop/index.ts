import { Message } from 'discord.js'

export default class StopCommand {

    static trigger = `${process.env.PREFIX}stop`

    static async run (message: Message, queues: Map<any, Queue>) {
        const queue = queues.get(message.guild.id)

        if (!message.member.voice.channel) {
            return message.channel.send("You need to be in a voice channel to stop the music")
        }

        queue.songs = []

        queue.connection.dispatcher.end()
    }
    
}