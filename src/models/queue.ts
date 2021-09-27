import { AudioPlayer, VoiceConnection } from "@discordjs/voice"
import { Message, StageChannel, TextBasedChannels, VoiceChannel } from "discord.js"
import Song from "./song"

export default class Queue {
    
    public id: any
    public text: TextBasedChannels
    public voice: VoiceChannel | StageChannel
    public songs: Song[]
    public connection: VoiceConnection
    public playing: Boolean
    public volume: Number
    public player: AudioPlayer

    constructor (message: Message) {
        this.id = message.guild.id
        this.text = message.channel
        this.voice = message.member.voice.channel
        this.songs = []
        this.volume = 5
        this.playing = true
    }
}