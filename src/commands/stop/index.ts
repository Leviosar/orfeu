import { Message } from 'discord.js'
import Queue from '../../models/queue'

export class StopCommand {

    public trigger: string

    constructor () {
        this.trigger = `${process.env.PREFIX}stop`
    }

    async run (message: Message, queues: Map<string, Queue>) {
        const queue = queues.get(message.guild.id)

        if (!message.member.voice.channel) {
            return message.channel.send("You need to be in a voice channel to stop the music")
        }

        queue.songs = []
        queue.player.stop()
    }
    
}