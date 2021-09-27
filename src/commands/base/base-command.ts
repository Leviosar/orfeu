import { Message } from 'discord.js'
import Queue from '../../models/queue';

export interface BaseCommand {
    trigger?: string
    help?: string
    run: (message: Message, queues: Map<string, Queue>) => void
}