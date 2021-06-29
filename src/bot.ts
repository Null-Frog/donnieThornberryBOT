import { config } from 'dotenv'
config();

import { Client } from 'discord.js'

const client: Client = new Client();
const path = require('path');
const ytdl = require('ytdl-core');

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

            client.on('guildMemberSpeaking', (member, speaking) => {
                const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=4GicJVYQvcg', { quality: 'highestaudio' }));
                if (speaking.bitfield == 1) {
                    dispatcher.resume();
                }
                if (speaking.bitfield == 0) {
                    dispatcher.pause();
                }
            });
        });
    }
});

client.login(process.env.DISCORD_TOKEN);