export default class LeaveCommand {

    static trigger = `${process.env.PREFIX}leave`

    static async run (message, queues) {
        const queue = queues.get(message.guild.id)

        if (!queue) return

        queue.songs = []
        await queue.voice.leave()
    }

}