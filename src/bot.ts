require('dotenv').config();

import { Client, VoiceConnection } from 'discord.js'
import { EventEmitter } from 'stream';

const client: Client = new Client();

EventEmitter.defaultMaxListeners = 200;

client.on('ready', () => {
    console.log('sheeeeee!');
})

var estaDespierto = false;

client.on('message', message => {
    if (message.content === '!awake') {
        estaDespierto = true;
        message.delete();
    } else if (message.content === '!sleep') {
        estaDespierto = false;
        message.delete();
    }
});


client.on('voiceStateUpdate', (oldState, newState) => {

    if (newState.channelID === null) {
        const canal = oldState.member?.voice.channel;
        canal?.leave();
    }
    else if (oldState.channelID === null) {
        const canal = newState.member?.voice.channel;
        if (estaDespierto) {
            canal?.join().then(connection => {
                hablaDonnie(connection);
            });
        }
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
        if (estaDespierto) {
            if (speaking.bitfield == 1) {
                dispatcher.resume();
            }
            else if (speaking.bitfield == 0) {
                dispatcher.pause();
            }
            dispatcher.on('finish', () => {
                hablaDonnie(connection);
            });
        } else {
            connection.disconnect();
        }
    });
}

client.login(process.env.DISCORD_TOKEN);