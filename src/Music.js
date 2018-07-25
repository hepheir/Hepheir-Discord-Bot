const fs = require('fs');
const https = require('https');
const ytdl = require('ytdl-core');

const API = JSON.parse( fs.readFileSync("data/api_key.json") );


class Music {
    constructor() {
        this.VOICE_CHANNEL = undefined;
        this.DISPATCHER = undefined;
        this.VOLUME = 100;
        this.QUEUE = [];
        this.REPEAT = 0;
        this.SEARCH_DATA;

        this.MAX_VOLUME = 1000;



        this.music = this.music.bind(this);
        this._searchFromYoutube = this._searchFromYoutube.bind(this);
        this._searchResult = this._searchResult.bind(this);
        this._addQueue = this._addQueue.bind(this);
        this.play = this.play.bind(this);
        this._playFromYoutube = this._playFromYoutube.bind(this);
        this.join = this.join.bind(this);
        this._join = this._join.bind(this);
        this.leave = this.leave.bind(this);
        this.volume = this.volume.bind(this);
        this._setVolume = this._setVolume.bind(this);


        this.repeat = this.repeat.bind(this);
        this._setRepeat = this._setRepeat.bind(this);
    }

    music(Command) {
        let cmd = getCmd(Command.message.content);
        let arg = getArg(Command.message.content);

        // 검색 모드 ON : 번호 입력 시
        if (this.SEARCH_DATA) {
            if (['c', '취소', 'ㅊㅅ', 'ㅊ'].includes(arg)) {
                this.SEARCH_DATA = undefined;
                Command.message.channel.send(`취소 되었습니다.`);
                return { requestSend : 1 };
            }

            arg = parseInt(arg);

            if (arg < 1 || arg > this.SEARCH_DATA.items.length) {
                return { requestPending : true };
            }

            let item = this.SEARCH_DATA.items[arg - 1];
            this.SEARCH_DATA = undefined;

            this._addQueue(item);
            Command.message.channel.send(`재생목록에 곡이 추가되었습니다.\n\`\`\`${item.snippet.title} <${item.snippet.length_seconds}seconds>\`\`\``);

            if (this.QUEUE.length == 1) {
                this.play(Command); 
            }

            return { requestSend : 1 };
        }

        // URL 입력 시
        if (arg.match(/^https:\/\//)) {
            try {
                this._playFromYoutube(arg);
            } catch(e) {console.log(e)}
            return { };
        }

        // 커맨드만 입력 시
        if (Command.isThis(cmd)) {
            if (cmd == arg) {
                Command.message.channel.send(`검색할 곡 명을 입력해주세요. ~_~`);
                return { requestPending : true, requestSend : 1 };
            }
        }

        // 곡 제목 입력 시
        console.log(3);
        let query = arg;

        this._searchFromYoutube(query, () => {
            this._searchResult(Command);
            Command.message.channel.send(`[곡 번호] 로 선택해 주세요. (취소하려면 [취소])`);
        });
        return { requestPending : true, requestSend : 2 };
        
    }

    _searchFromYoutube(query = '', callback = function(){}) {
        let url = `https://www.googleapis.com/youtube/v3/search?key=${API.Youtube.key}&part=snippet&q=${encodeURIComponent(query)}`;

        https.get(url, response => {
            let data = '';

            response.on('data', chunk => {
                data += chunk;
            })
            
            response.on('end', () => {
                this.SEARCH_DATA = JSON.parse(data);
                callback();
            })
        }).on("error", err => console.log);
    }

    _searchResult(Command) {
        if (!this.SEARCH_DATA) {
            return {};
        }

        let str = '```';

        let i, item;
        for (i = 0; i < this.SEARCH_DATA.items.length; i++) {
            item = this.SEARCH_DATA.items[i];
            str += `${i + 1}. ${item.snippet.title}\n\n`;
        }

        str += '```\n';

        Command.message.channel.send(str);
        return { requestPending : true, requestSend : 1 };
    }
    
    _addQueue(YoutubeSearchItem) {
        this.QUEUE.push(YoutubeSearchItem);
    }

    play(Command) {
        let item = this.QUEUE.shift();
        if (!item) {
            Command.message.channel.send(`재생목록에 곡이 없습니담... ('~ ')`);
            return { requestSend : 1 };
        }

        if (!this.VOICE_CHANNEL) {
            this.join(Command);
        }

        this._playFromYoutube(item.id.videoId);
        return {};
    }

    _playFromYoutube(videoID = '') {
        if (!this.VOICE_CHANNEL) {
            console.log('you must be in a voice channel to play music.');
            return;
        }

        const stream = ytdl(videoID, { filter : 'audioonly' });

        if (this.DISPATCHER) {
            this.DISPATCHER.end();
        }

        this.DISPATCHER = this.VOICE_CHANNEL.connection.playStream(stream, {
            seek : 0,
            volume : this.VOLUME / this.MAX_VOLUME
        });

        this.DISPATCHER.on('end', () => {
            this.DISPATCHER = undefined;
        });
    }

    join(Command) {
        if (!Command.message.member.voiceChannel) {
            Command.message.channel.send(`음성 채널에 먼저 접속한 뒤에 불러주세요. ㅎㅎ`);
            return;
        }
    
        this._join(Command.message.member.voiceChannel);

        Command.message.channel.send(`왔어요 왔어, 제가 왔습니다!`);

        return { requestSend : 1 };
    }

    _join(voiceChannel) {
        this.VOICE_CHANNEL = voiceChannel;
        this.VOICE_CHANNEL.join();
    }

    leave(Command) {
        let msg = Command.message;
        
        if (!this.VOICE_CHANNEL) return;
    
        let repeat = this.REPEAT;

        this.REPEAT = 0;
        this.VOICE_CHANNEL.leave();

        msg.channel.send(`지금 바로 나갑니다!`);

        this.REPEAT = repeat;
        this.VOICE_CHANNEL = undefined;

        return { requestSend : 1 };
    }

    volume(Command) {
        let cmd = getCmd(Command.message.content);
        let arg = getArg(Command.message.content);

        if (cmd == arg) {
            Command.message.channel.send(`현재 볼륨값은 \`(${this.VOLUME}/${this.MAX_VOLUME})\` 입니다. _(ㅇ. < )/`);
            return { requestSend : 1 };
        }

        let vol = Number(arg);

        if (0 < vol && vol <= this.MAX_VOLUME) {
            this._setVolume(vol);
            Command.message.channel.send(`볼륨값을 \`(${this.VOLUME}/${this.MAX_VOLUME})\` 으로 설정완료. 다음곡부터 적용됩니다! > <`);
            
            return { requestSend : 1 };
        }
        else {
            Command.message.channel.send(`볼륨 명령어의 사용법은 [볼륨 <숫자(1~${this.MAX_VOLUME})>]입니다! ^오^`);
            
            return { requestSend : 1 };
        }
    }

    _setVolume(vol) {
        this.VOLUME = vol;
    }






    repeat(Command) {
        let msg = Command.message;

        let rpt = getArg(msg.content);

        switch (rpt) {
            case 'off':
                msg.channel.send(`반복 없음.`);
                break;
            case 'on':
                msg.channel.send(`목록 반복.`);
                break;
            case 'one':
                msg.channel.send(`한 곡 반복.`);
                break;
        
            default:
                msg.channel.send(`다음 값 중에서 하나만 입력 가능합니다!
off - 반복 없음
on  - 목록 전체 반복
one - 한 곡 반복
`);
                return;
        }

        this._setRepeat(rpt);
    }

    _setRepeat(repeat) {
        this.REPEAT = repeat;
    }
}

function getCmd(message) {
    if (!message.includes(' ')) {
        return message;
    } else {
        return message.split(' ')[0];
    }
}

function getArg(message) {
    if (!message.includes(' ')) {
        return message;
    } else {
        return message.slice(message.split(' ')[0].length + 1);
    }
}

module.exports = new Music();