import { Message } from "discord.js"
import Queue from "../../models/queue"

export class QueueCommand {

    public trigger: string

    constructor () {
        this.trigger = `${process.env.PREFIX}queue`
    }

    run (message: Message, queues: Map<string, Queue>) {
        const queue = queues.get(message.guild.id)

        if (queue.songs.length == 0) {
            message.channel.send("Queue is empty")
        } else {
            let content = ""
            
            for (let i = 0; i < queue.songs.length; i++) {
                content += `${i + 1} - ${queue.songs[i].title} \n`            
            }

            message.channel.send(content)
        }
    }

}