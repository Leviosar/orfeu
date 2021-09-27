import { Message } from "discord.js"
import Queue from "../../models/queue"

export class SkipCommand {

    public trigger: string

    constructor () {
        this.trigger = `${process.env.PREFIX}skip`
    }

    run (message: Message, queues: Map<string, Queue>) {
        const queue = queues.get(message.guild.id)

        if (!message.member.voice.channel) {
            return message.channel.send("You need to be in a voice channel to skip the music")
        }

        if (!queue) {
            return message.channel.send("Queue is already empty")
        }

        queue.player.stop()
    }

}