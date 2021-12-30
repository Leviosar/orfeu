import { Message } from "discord.js"
import Log from "../../logger/index.js"
import Queue from "../../models/queue"

export class LeaveCommand {

    public trigger: string

    constructor () {
        this.trigger = `${process.env.PREFIX}leave`
    }

    async run (message: Message, queues: Map<string, Queue>) {
        Log.command(`(#${message.author.id}) - ${message.author.username} - Called LeaveCommand`)
        const queue = queues.get(message.guild.id)

        if (!queue) return

        queue.songs = []
        queue.connection.destroy()
        queue.connection = null
    }

}