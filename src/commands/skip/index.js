export default class SkipCommand {

    static trigger = `${process.env.PREFIX}skip`

    static run (message, queues) {
        const queue = queues.get(message.guild.id)

        if (!message.member.voice.channel) {
            return message.channel.send("You need to be in a voice channel to skip the music")
        }

        if (!queue) {
            return message.channel.send("Queue is already empty")
        }

        queue.connection.dispatcher.end()
    }

}