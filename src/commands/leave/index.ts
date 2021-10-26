import { Message } from "discord.js"
import Queue from "../../models/queue"

export class LeaveCommand {

    public trigger: string

    constructor () {
        this.trigger = `${process.env.PREFIX}leave`
    }

    async run (message: Message, queues: Map<string, Queue>) {
        const queue = queues.get(message.guild.id)

        if (!queue) return

        queue.songs = []
        queue.connection.destroy()
        queue.connection = null
    }

}