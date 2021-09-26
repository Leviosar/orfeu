export default class QueueCommand {
    
    static trigger = `${process.env.PREFIX}queue`

    static run (message, queues) {
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