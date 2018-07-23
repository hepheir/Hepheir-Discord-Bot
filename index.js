'use strict';

const fs = require('fs');
const ytdl = require('ytdl-core');


// DISCORD BOT

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`${client.user.tag}로 로그인에 성공!`);
});

client.login('NDcwNjU1MjExMTQ5NTkwNTI4.DjcaKg.wSbX_nq6sNnrIBU0VX19O2dVrWg');


// Command Handling
    
    var PENDING = undefined; // Pending action.

    client.on('message', msg => {
        // Ignore unsupported messages
        if (!msg.guild || msg.author.bot) return;

        // Execute pending actions first
        if (PENDING) { PENDING(msg); return; }

        // Execute supported Commands
        let isFound = false;
        COMMAND.forEach(c => c.names.forEach( cmd => {
            if (!isFound && msg.content.startsWith(cmd)) {
                c.action(msg);
                isFound = true;
            }
        }));
    });


// Command list.

    var COMMAND = [
        {
            names: ['노래', 'ㄴㄹ'],
            action : _music,
            desc : "유튜브에서 노래를 찾아 재생합니다."
        },
        {
            names : ['재생목록', 'ㅈㅅㅁㄹ', '리스트', 'ㄹㅅㅌ'],
            action : _showQueue,
            desc : "현재 재생목록을 보여줍니다."
        },
        {
            names: ['재생', 'ㅈㅅ'],
            action : _play,
            desc : "노래를 재생합니다."
        },
        {
            names : ['이리로' , '이리와', '들어와', 'ㅇㄹㅇ', '드루와'],
            action : _join,
            desc : "음성 채널에 참가합니다."
        },
        {
            names : ['나가', 'ㄴㄱ', '꺼져', '싫어'],
            action : _leave,
            desc : "접속중인 음성 채널에서 나갑니다."
        },
        {
            names : ['볼륨', 'ㅂㄹ'],
            action : _volume,
            desc : "노래의 볼륨을 설정합니다! : 1 ~ 1000 (재생중인 곡의 다음 곡부터 적용)"
        },
        {
            names : ['다음', 'ㄷㅇ'],
            action : _next,
            desc : "재생목록의 다음 곡을 재생합니다."
        },
        {
            names : ['태완', '정태완', '김수빈', '수빈', '김숩', '숩', '오태영', '태영띠', '민호', '호우', '민호우', '불꽃카리스마민호', '용재', '용짜이', '이용재'],
            action : _rememberSoldier,
            desc : "우리의 소중한 친구들을 기억합니다."
        },
        {
            names : ['헲', '헬프', 'help', '도움말', '도움', '?'],
            action : _tips,
            desc : "도움말을 보여줍니다."
        }
    ];


// 기타

    function _rememberSoldier(msg) {
        msg.channel.send(`${msg.content}, 그 친구는... 군대갔어... ㅠㅠ`);
    }

    function _tips(msg) {
        let str = '\`';

        COMMAND.forEach(c => str += `['${c.names.join("', '")}'] : ${c.desc}\n`);

        str += '\`';

        msg.channel.send(str);
    }

// MUSIC

var BOT = {
    voiceChannel : undefined,
    dispatcher : undefined,
    volume : 100,
    queue : [],
    repeat : 1 // 0 : false, 1 : all, 2 : one
}

// 음성 채널

    function _join(msg) {
        if (!msg.member.voiceChannel) msg.reply(`음성 채널에 먼저 접속한 뒤에 불러주세요. ㅎㅎ`);

        BOT.voiceChannel = msg.member.voiceChannel;
        return BOT.voiceChannel.join();
    }

    function _leave(msg) {
        if (!BOT.voiceChannel) return;

        BOT.voiceChannel.leave();
        BOT.voiceChannel = undefined;
    }


// 재생

    function _play(msg) {
        if (!BOT.voiceChannel) _join(msg);
        
        let source = BOT.queue[0];

        if (!source) {
            msg.channel.send("재생목록에 곡이 없습니담... ('~ ')");
            console.log(BOT.queue);
            return;
        }

        const stream = ytdl(source.url, {filter : 'audioonly' });

        BOT.dispatcher = BOT.voiceChannel.connection.playStream(stream, { seek : source.start_second, volume : BOT.volume / 1000 });
        BOT.dispatcher.on('end', () => {
            BOT.dispatcher = undefined;
            _next(msg);
        });

        msg.channel.send(`Now playing... ${source.title} added by ${source.owner}\nlength: ${source.length_seconds} seconds.`);
    }

    function _next(msg) {
        switch (BOT.repeat) {
            case 0:
                BOT.queue.shift();
                break;
                
            case 1:
                BOT.queue.push(BOT.queue.shift())
                break;

            case 2:
                // No changes.
                break;
        }

        if (!BOT.queue[0]) {
            _leave(msg);
        }

        _play(msg);
    }


// 설정

    function _volume(msg) {
        if (!msg.content.includes(' ')) {
            msg.channel.send("볼륨 명령어의 사용법은 `볼륨 숫자(1~1000)`입니다! ^오^");
            return;
        }


        let vol = Number(msg.content.split(' ')[1]);

        if ( !(0 < vol && vol <= 1000) ) {
            msg.channel.send("띠요오오옹~ 1부터 1000사이의 값이 아니네요? -.-");
            return;
        }

        BOT.volume = vol;
        msg.channel.send(`볼륨값을 ${BOT.volume}으로 설정완료.\n다음곡부터 적용됩니다! > <`);
    }

    function _music(msg) {
        let url = msg.content.split(' ')[1];
        
        _addQueue(url, msg.member.nickname, 0)
            .then(() => _play(msg));
    }

    function _addQueue(url, owner, startAt) {
        return ytdl.getInfo(url)
            .catch(e => console.log)
            .then(info => {
                BOT.queue.push({
                    url: url,
                    owner: owner,
                    title: info.title,
                    start_second: startAt,
                    length_seconds: info.length_seconds
                });
            });
    }

    function _showQueue(msg) {
        let str = '';

        let i, source;
        for (i = 0; i < BOT.queue.length; i++) {
            source = BOT.queue[i];

            str += `${i}. ${source.title} [${source.length_seconds}seconds]\n`;
        }
        
        if (str === '') str = "재생목록에 곡이 없습니담... ('~ ')";
        msg.channel.send(str);
    }