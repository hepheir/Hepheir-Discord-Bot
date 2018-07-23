'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`${client.user.tag}로 로그인에 성공!`);
});

client.login('NDcwNjU1MjExMTQ5NTkwNTI4.DjcaKg.wSbX_nq6sNnrIBU0VX19O2dVrWg');


var BOT = {
    voiceChannel : undefined,
    dispatcher : undefined
};

var COMMAND = [
    {
        names : ['노래'],
        action : msg => {
            if (!msg.member.voiceChannel) {
                msg.reply(`음성 채널에 먼저 접속한 뒤에 불러주세요.`);
            }
    
            BOT.voiceChannel = msg.member.voiceChannel;
            BOT.voiceChannel.join()
                .then(connection => {
                    BOT.dispatcher = connection.playFile('./test.mp3');
                    BOT.dispatcher.on('end', () => { BOT.dispatcher = undefined });
                })
                .catch(e => {
                    console.log(e);
                    BOT.dispatcher = undefined;
                })
        }
    },
    {
        names : ['나가', '꺼져', '싫어'],
        action : msg => {
            if (!BOT.voiceChannel) return;

            if (BOT.dispatcher) {
                BOT.dispatcher.end();
            }

            BOT.voiceChannel.leave();
            BOT.voiceChannel = undefined;
        }
    },
    {
        names : ['볼륨'],
        action : msg => {}
    },
    {
        names : [],
        action : msg => {}
    }
];


client.on('message', msg => {
    if (!msg.guild || msg.author.bot) return;

    COMMAND.forEach(c => c.names.forEach( cmd => {
        if (msg.content.startsWith(cmd)) {
            c.action(msg);
            return;
        }
    }));
});