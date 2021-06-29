import { config } from 'dotenv'
config();

import { Client, StreamDispatcher, VoiceConnection } from 'discord.js'
import { EventEmitter } from 'stream';

const client: Client = new Client();

EventEmitter.defaultMaxListeners = 50;

client.on('ready', () => {
    console.log('sheeeeee!');
})

client.on('voiceStateUpdate', (oldState, newState) => {

    if (newState.channelID === null) {
        const canal = oldState.member?.voice.channel;
        console.log('user salio del canal', oldState.channelID);
        canal?.leave();
    }
    else if (oldState.channelID === null) {
        const canal = newState.member?.voice.channel;
        console.log('user se unio al canal', newState.channelID);
        canal?.join().then(connection => {
            hablaDonnie(connection);
        });
    }
});

/**
 * Esta función recursiva hace que hable Donnie cuando detecta algún
 * sonido en discord
 * @param connection 
 */
function hablaDonnie(connection: VoiceConnection) {
    const dispatcher = connection.play('./sound.wav');
    client.on('guildMemberSpeaking', (member, speaking) => {
        if (speaking.bitfield == 1) {
            dispatcher.resume();
        }
        else if (speaking.bitfield == 0) {
            dispatcher.pause();
        }

        dispatcher.on('finish', () => {
            hablaDonnie(connection);
        });
    });
}

client.login(process.env.DISCORD_TOKEN);
