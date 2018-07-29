const Command = require('../src/Command.js');

const fs = require('fs');
const https = require('https');
const ytdl = require('ytdl-core');

const API = JSON.parse(fs.readFileSync("data/api_key.json"));


// Player Properties

var Setting = {
    MAX_SEARCH : 7,
    MAX_VOLUME : 1000,
    REPEAT     : 0
};

var Status = {
    volume : 300,
    get isPlaying() {
        return Player.voiceConnection !== undefined;
    },
    get currentRepeatName() {
        switch (Setting.REPEAT) {
            case 0:
                return '반복 없음';

            case 1:
                return '전체 반복';

            case 2:
                return '한 곡 반복';
        }

        throw `Something is wrong? @ Setting.REPEAT`;
    },
    get currentQueueItem() {
        return Player.queue[0];
    }
};

var Player = {
    voiceConnection : undefined,
    queue        : []
};

var REPEAT = {
    OFF : ['0', 'off', '없음', 'ㄴ', '끔', 'ㄲ', '해제', 'ㅎㅈ'],
    ON  : ['1', 'on', 'all', '있음', 'ㅇ', '켬', 'ㅋ', '전체', 'ㅈㅊ', '목록', 'ㅁㄹ'],
    ONE : ['2', 'one', '한곡', '한 곡', '하나', '한', 'ㅎ']
}


// Helpers

function searchFromYT(query) {
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API.Youtube.key}&part=snippet&q=${encodeURIComponent(query)}&maxResults=${Setting.MAX_SEARCH}`;

    return new Promise(((resolve, reject) => {
        https.get(searchUrl, response => {
            let data = '';

            response.on('data', chunk => {
                data += chunk;
            })
            
            response.on('end', () => {
                resolve(JSON.parse(data));
            })
        }).on("error", err => reject(err));
    }));
}

function joinVoiceChannel(voiceChannel) {
    if (!voiceChannel) {
        if (!Player.voiceConnection)
            return undefined;

        return new Promise((resolve, reject) => {
            resolve(Player.voiceConnection);
        });
    }

    if (Player.voiceConnection === voiceChannel)
        return new Promise((resolve, reject) => {
            resolve(Player.voiceConnection);
        });

    return voiceChannel.join().then(connection => {
        connection.on('disconnect', () => {
            Player.voiceConnection = undefined;
        });
        Player.voiceConnection = connection;
        return connection;
    });
}

function leaveVoiceChannel() {
    if (!Player.voiceConnection) return undefined;

    Player.voiceConnection.channel.leave();
    Player.voiceConnection = undefined;

    return true;
}

function parseContent(content) {
    let Prefix;

    let found = LIST.find(Command => {
        let name = Command.name;
        let { subnames } = Command.option;

        if (content.startsWith(name)) {
            Prefix = name;
        } else {
            subnames.find(sn => {
                if (content.startsWith(sn))
                    Prefix = sn;
            });
        }

        return Prefix !== undefined;
    });
    if (!found) return content;
    
    return content.slice(Prefix.length);
}

function onPlayerEnd(Handler) {
    let item = Status.currentQueueItem;

    switch (Setting.REPEAT) {
        case 0: // No repeat
            Player.queue.unshift();
            break;

        case 1: // Repeat all
            Player.queue.unshift();
            Player.queue.push(item);
            break;

        case 2: // Repeat one
            break;
    }

    if (Player.queue.length > 0) {
        Handler.callCommand('재생');
    }

    return item;
}


// Commands

const LIST = [
/* Commands
,
    new Command('', {
        subnames  : [],
        desc      : undefined,
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
    })
*/
    new Command('참가', {
        subnames  : ['ㅊㄱ', '이리와', 'ㅇㄹㅇ', '들어와', 'ㄷㅇㅇ', '드루와', 'ㄷㄹㅇ'],
        desc      : '찐땅봇이 음성 채널에 접속합니다.',
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        let voiceChannel = Handler.lastMessage.member.voiceChannel;

        let joined = joinVoiceChannel(voiceChannel);
        if (joined) {
            Handler.send(`왔어요 왔어, 제가 왔습니다!`);
        } else {
            Handler.send(`음성 채널에 먼저 접속한 뒤에 불러주세요. ㅎㅎ`);
        }
    })
,
    new Command('나가기', {
        subnames  : ['ㄴㄱㄱ', 'ㄴㄲ', '나가', 'ㄴㄱ', 'sr'],
        desc      : '찐땅봇이 음성 채널에서 퇴장합니다.',
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        if (leaveVoiceChannel()) {
            Handler.send(`지금 바로 나갑니다!`);
        } else {
            Handler.send(`...? 띠용~`);
        }
    })
,
    new Command('노래', {
        subnames  : ['ㄴㄹ', 'sf'],
        desc : '유튜브에서 노래를 검색하거나, url을 직접 입력하여 재생합니다.',
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        Handler.lastMessage.delete();

        let isUrl = Handler.lastMessage.content.match(/^https:\/\//);
        if (isUrl) {
            Handler.callCommand('재생');
        }

        Handler.callCommand('검색');
    })
,
    new Command('검색', {
        subnames  : [],
        condition : {
            onCommand : false,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        Handler.startCommand('검색');

        let content = Handler.lastMessage.content;

        // Check if query is given.
        let query = parseContent(content);

        if (!query) {
            Handler.send(`검색할 곡 명을 입력해주세요. ~_~`)
            .then(botMessage => {
                Handler.client.once('message', userMessage => {
                    Handler.endCommand('다시 검색 예정');
    
                    Handler.history.add(userMessage);
                    Handler.callCommand('검색');
                });
            });
            return;
        }

        // Search from Youtube.
        let SearchData = undefined;
        searchFromYT(query)
        .catch(err => {
            console.log('Failed to search from Youtube!', err);
            return undefined;
        })
        .then(sData => {
            if (!sData) return;
            SearchData = sData;

        // Print searched data.
            let title;
            let content = '**검색 결과**';

            content += '```';
            for (let i = 0; i < SearchData.items.length; i++) {
                title = SearchData.items[i].snippet.title;
                content += `${i + 1}. ${title}\n\n`;
            }
            content += '```\n';

            content += `[곡 번호] 로 선택해 주세요. (취소하려면 [취소])`;

            Handler.send(content)
        .then(listMessage => {
        // Wait for an input to select an item.
            Handler.client.once('message', userMessage => {
                listMessage.delete();

                let select = userMessage.content
                             .match(/(1|2|3|4|5|6|7|8|9|0)+/g);
                
                if (!select || select > Setting.MAX_SEARCH) {
                    Handler.send(`취소되었습니다.`);

                    Handler.endCommand('검색 취소');
                    return;
                }
                // 1BI => 0BI (Zero base index)
                select--; 

                userMessage.delete();

        // Add to queue.
                let item = SearchData.items[select];

                // Register the member who queued.
                item.member = Handler.lastMessage.member;
                Player.queue.push(item);

                let dialog = '';

                dialog += `**재생목록에 곡이 추가되었습니다.**\n`;
                dialog += `\`\`\`${item.snippet.title}\`\`\``;
                dialog += `(대기열 순서 : ${Player.queue.length})`;

                Handler.send(dialog)
        .then(dialogMessage => {
            Handler.endCommand('검색 성공');

        // Play if it is the only item.
            if (Player.queue.length == 1) {
                let joined = joinVoiceChannel(item.member.voiceChannel);
                if (!joined) return;

                joined.then(connection => {
                    Handler.callCommand('재생');
                });
            }
        });
        });
        });
        });
    })
,
    new Command('대기열', {
        subnames  : ['ㄷㄱㅇ', '리스트', 'ㄹㅅㅌ', '재생목록', 'ㅈㅅㅁㄹ'],
        desc      : '현재 재생목록 대기열을 보여줍니다.',
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        let Queue = Player.queue;

        if (Queue.length == 0) {
            Handler.send(`재생목록에 곡이 없습니담... ('~ ')`);
            return;
        }

        let dialog = '';

        dialog += `**현재 재생목록**\n`;
        
        dialog += `\`\`\``;
        for (let i = 0; i < Queue.length; i++) {
            dialog += `${i + 1}. `;

            if (i == 0 && Status.isPlaying)
                dialog += `<재생중> `;

            dialog += `${Queue[i].snippet.title}\n\n`;
        }
        dialog += `\`\`\`\n`;

        Handler.send(dialog);
    })
,
    new Command('재생', {
        subnames  : ['ㅈㅅ'],
        desc      : '대기열의 첫 번째 곡을 재생합니다.',
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        // Resume if paused
        if (Player.voiceConnection) {
            let dispatcher = Player.voiceConnection.dispatcher;
            
            if (dispatcher) {
                if (dispatcher.paused) {
                    dispatcher.resume();
                    Handler.send(`이어서 재생합니다.`);
                    return;
                }
            }
        }

        if (Player.queue.length == 0) {
            Handler.send(`재생목록에 곡이 없습니다... ㅠㅠ`);
            return;
        }

        Handler.startCommand('재생');

        // Be in a voiceChannel
        let voiceChannel = Handler.lastMessage.member.voiceChannel;
        let joined = joinVoiceChannel(voiceChannel);
        
        if (!joined) {
            Handler.send(`음성 채널에 먼저 접속한 뒤에 불러주세요. ㅎㅎ`)
            .then(errMessage => {
                Handler.endCommand('재생 실패 : 음성채널 접속 x');
            });
            return;
        }

        joined.then(connection => {
            let item = Status.currentQueueItem;

        // Stream Youtube video
            let videoId = item.id.videoId;
            const stream = ytdl(videoId, { filter : 'audioonly' });

            let dispatcher = connection.playStream(stream, {
                seek : 0,
                volume : Status.volume / Setting.MAX_VOLUME
            });
            Player.voiceConnection = connection;

            Handler.client.user.setPresence({ game: { name: `${item.snippet.title}` }, status: 'idle' });
            
        // Print message.
            let dialog = '';

            dialog += `**지금 재생 중...**\n`;
            dialog += `\`\`\`${item.snippet.title}\`\`\``;
            dialog += `[*@${item.member.nickname || item.member.user.username}*]`;

            Handler.send(dialog).then(dialogMessage => {
                Handler.endCommand();
            });

        // onEnd Listener
            dispatcher.on('end', () => {
                onPlayerEnd(Handler);
                Handler.client.user.setPresence({ game: { name: `` }, status: 'online' });
            });
        })
        .catch(err => {
            Handler.endCommand();
            console.log(err);
        })
    })
,
    new Command('일시정지', {
        subnames  : ['ㅇㅅㅈㅈ', '정지'],
        desc      : '현재 재생중인 노래를 일시정지 합니다.',
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        if (!Player.voiceConnection) {
            Handler.send(`재생중인 노래가 없습니다.`);
            return;
        }

        Handler.lastMessage.delete();

        Player.voiceConnection.dispatcher.pause();
        Handler.send(`일시정지 되었습니다.`);
    })
,
    new Command('다음', {
        subnames  : ['ㄷㅇ'],
        desc      : '대기열의 다음 노래를 재생합니다.',
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        onPlayerEnd(Handler);
    })
,
    new Command('큐 초기화', {
        subnames  : ['ㅋㅊㄱㅎ', '초기화', 'ㅊㄱㅎ', '큐 비우기', 'ㅋㅂㅇㄱ', '비우기', 'ㅂㅇㄱ'],
        desc      : '현재 대기열을 초기화 합니다.',
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        Player.queue = [];
        Handler.send(`대기열이 깨끗하게 비워졌습니다.`);
    })
,
    new Command('볼륨', {
        subnames  : ['ㅂㄹ'],
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        let content = Handler.lastMessage.content;

        let currentVol = Status.volume;
        let maxVol     = Setting.MAX_VOLUME;

        let vol = parseContent(content);

        if (!vol) {
            Handler.send(`현재 볼륨값은 \`(${currentVol}/${maxVol})\` 입니다. _(ㅇ. < )/`);
            return;
        }

        vol = Number(vol);

        if (0 < vol && vol <= maxVol) {
            Status.volume = vol;
            Handler.send(`볼륨값을 \`(${vol}/${maxVol})\` 으로 설정완료. 다음곡부터 적용됩니다! > <`);
            return;
        }

        Handler.send(`볼륨 명령어의 사용법은 [볼륨 <숫자(1~${maxVol})>]입니다! ^오^`);
        return;
    })
,
    new Command('반복', {
        subnames  : ['ㅂㅂ', 'ㅃ'],
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    }, Handler => {
        let content = Handler.lastMessage.content;

        let repeat = parseContent(content).toLowerCase();

        if (!repeat) {
            Handler.send(`현재 <${Status.currentRepeatName}(${Setting.REPEAT})> 으로 설정되어 있습니다.`);
            return;
        }

             if (REPEAT.OFF.includes(repeat)) repeat = 0;
        else if ( REPEAT.ON.includes(repeat)) repeat = 1;
        else if (REPEAT.ALL.includes(repeat)) repeat = 2;

        else {
            let dialog = '';

            dialog += `**반복 설정 값**\n`;
            dialog += `\`\`\``;
            dialog += `<${Status.currentRepeatName(0)}> : `;
            dialog += `\`[${REPEAT.OFF.join(', ')}]\``;
            dialog += `<${Status.currentRepeatName(1)}> : `;
            dialog += `\`[${REPEAT.ON.join(', ')}]\``;
            dialog += `<${Status.currentRepeatName(2)}> : `;
            dialog += `\`[${REPEAT.ONE.join(', ')}]\``;
            dialog += `\`\`\``;

            Handler.send(dialog);
            return;
        }

        Setting.REPEAT = repeat;
        Handler.send(`<${Status.currentRepeatName(repeat)}> 으로 설정완료. 다음곡부터 적용됩니다! > <`);
    
        return;
    })
];

module.exports = LIST;