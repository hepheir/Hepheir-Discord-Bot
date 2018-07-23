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

var STRING = {
    joinFirst : "음성 채널에 먼저 접속한 뒤에 불러주세요.",
    hereIAm : "왔다 왔다, 내가 왔다!"
};



client.on('message', msg => {
    if (!msg.guild || msg.author.bot) return;

    if (msg.content === '나가' || msg.content === '꺼져' || msg.content === '싫어') {
        if (!BOT.voiceChannel) return;

        if (BOT.dispatcher) {
            BOT.dispatcher.end();
        }

        BOT.voiceChannel.leave();
        BOT.voiceChannel = undefined;
    }

    if (msg.content === '노래') {
        
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
});