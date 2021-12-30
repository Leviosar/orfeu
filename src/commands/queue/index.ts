import { Message, MessageEmbed, MessageEmbedOptions } from "discord.js"
import Log from "../../logger/index.js"
import Queue from "../../models/queue"

export class QueueCommand {

    public trigger: string

    constructor () {
        this.trigger = `${process.env.PREFIX}queue`
    }

    run (message: Message, queues: Map<string, Queue>) {
        Log.command(`(#${message.author.id}) - ${message.author.username} - Called QueueCommand`)
        const queue = queues.get(message.guild.id)

        if (!queue || queue.songs.length == 0) {
            message.channel.send("Queue is empty")
        } else {
            let content = ""
            
            for (let i = 0; i < Math.min(queue.songs.length, 10); i++) {
                content += `\`${i + 1}.\` [${queue.songs[i].title} \n](${queue.songs[i].url})`
                
            }

            message.channel.send({
                embeds: [{
                    color: 0,
                    title: `There's currently ${queue.songs.length} songs on the queue`,
                    description: content
                }]
            })
        }
    }

}