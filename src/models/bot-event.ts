export default interface BotEvent {
    name: string
    once: boolean
    execute: (...args) => void
}