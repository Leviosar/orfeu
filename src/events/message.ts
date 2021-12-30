import { Message } from "discord.js"
import Winston from "winston"
import { BaseCommand } from "../commands/base/base-command"
import { ExecuteCommand } from "../commands/execute/index.js"
import { LeaveCommand } from "../commands/leave/index.js"
import { QueueCommand } from "../commands/queue/index.js"
import { SkipCommand } from "../commands/skip/index.js"
import { StopCommand } from "../commands/stop/index.js"
import BotEvent from "../models/bot-event"

const queues = new Map()

const commands: BaseCommand[] = [
    new ExecuteCommand(),
    new SkipCommand(),
    new LeaveCommand(),
    new StopCommand(),
    new QueueCommand()
]

export default {
    name: "messageCreate",
    once: false,
    execute (message: Message) {
        if(message.author.bot) return
    
        if(!message.content.startsWith(process.env.PREFIX)) return
        
        let valid = false

        for (const command of commands) {
            if(message.content.startsWith(command.trigger)) {
                command.run(message, queues)
                valid = true
            }
        }
        
        if (!valid) {
            message.channel.send("You need to enter a valid command!")
        }
    }
} as BotEvent