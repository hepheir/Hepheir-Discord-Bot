'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`${client.user.tag}로 로그인에 성공!`);
});

client.login('NDcwNjU1MjExMTQ5NTkwNTI4.DjcaKg.wSbX_nq6sNnrIBU0VX19O2dVrWg');


client.on('message', msg => {
    if (msg.content === '야') {
        msg.reply('왜그러세요 주인님?');
        return;
    }

    if  (msg.content === '이리와') {
        if (msg.member.voiceChannel) {
            msg.member.voiceChannel.join()
                .then(connection => {
                    msg.reply('왔다 왔다, 내가 왔다!');
                })
                .catch(console.log);
        } else {
            msg.reply(`음성 채널에 먼저 접속한 뒤에 불러주세요.`);
        }
        return;
    }

    if (msg.content === '노래') {
        msg.member.voiceChannel.join()
            .then(connection => {
                let dispatcher = connection.playFile('./test.mp3');
            });
    }
});