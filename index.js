'use strict';

const fs = require('fs');
const ytdl = require('ytdl-core');

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`${client.user.tag}로 로그인에 성공!`);
});

client.login('NDcwNjU1MjExMTQ5NTkwNTI4.DjcaKg.wSbX_nq6sNnrIBU0VX19O2dVrWg');


var BOT = {
    voiceChannel : undefined,
    dispatcher : undefined,
    volume : 1
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
                    let url = undefined;
                    try {
                        url = msg.content.split(' ')[1];
                    }
                    catch(e) {
                        throw e;
                    }

                    if (!url) {
                        msg.channel.send('재생할 유튜브 url을 명령어 뒤에 함께 입력해 주세요.\n예시) `노래 https://www.youtube.com/watch?v=qvJ1FHRR1n`');
                        throw 'Url is required';
                    }
                    
                    const stream = ytdl(url, {filter : 'audioonly' });

                    BOT.dispatcher = connection.playStream(stream, { seek : 0, volume : BOT.volume / 100 });
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
        action : msg => {
            let vol = undefined;
            try {
                vol = Number(msg.content.split(' ')[1]);
            }
            catch(e) {
                throw e;
            }

            if (!vol) {
                msg.channel.send('설정할 볼륨의 크기를 입력해 주세요. (1 ~ 100)\n예시) `볼륨 42`');
                throw 'Url is required';
            }

            if (vol > 100 || vol < 0) {
                msg.channel.send('1부터 100사이의 볼륨만 가능합니다~');
                return;
            }

            BOT.volume = vol;
            
            msg.channel.send(`볼륨값을 ${BOT.volume}으로 설정완료.\n다음곡부터 적용됩니다!`);
        }
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