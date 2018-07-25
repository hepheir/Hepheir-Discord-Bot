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
        this.REPEAT = 0; // 0: 반복 없음, 1: 목록 반복, 2: 한 곡 반복
        this.SEARCH_DATA;

        this.MAX_VOLUME = 1000;
        this.NOW_PLAYING = undefined;



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
        this._showQueue = this._showQueue.bind(this);
        this.skip = this.skip.bind(this);


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

            if ( !( 1 <= arg && arg <= this.SEARCH_DATA.items.length) ) {
                return { requestPending : true };
            }

            let item = this.SEARCH_DATA.items[arg - 1];
            this.SEARCH_DATA = undefined;

            this._addQueue(item);
            Command.message.channel.send(`재생목록에 곡이 추가되었습니다.\n\`\`\`${item.snippet.title}\`\`\``);

            if (!this.NOW_PLAYING && this.QUEUE.length == 1) {
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
    
        // 음성 채널 확인
        if (!this.VOICE_CHANNEL) {
            this.join(Command);
        }

        this._playFromYoutube(item.id.videoId);
        this.NOW_PLAYING = item;

        Command.message.channel.send(`현재 재생중...\n\`\`\`${this.NOW_PLAYING.snippet.title}\`\`\``);

        this.DISPATCHER.on('end', () => {
            if (this.REPEAT == 0) {
                this.NOW_PLAYING = undefined;
                this.DISPATCHER = undefined;
                return;
            }
        
            // 목록 전체 반복
            if (this.REPEAT == 1) {
                this.QUEUE.push(this.NOW_PLAYING);
            }
            // 한 곡 반복
            else if (this.REPEAT == 2) {
                this.QUEUE.unshift(this.NOW_PLAYING);
            }

            this.NOW_PLAYING = undefined;

            if (this.VOICE_CHANNEL) {
                this.play(Command);
            }
        })
        return { requestSend : 1 };
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

    _showQueue(Command) {
        let str = '';

        if (this.NOW_PLAYING) {
            str += `현재 재생중...\n\`\`\`${this.NOW_PLAYING.snippet.title}\`\`\`\n`;
        }

        str += '현재 재생목록\n```';

        if (this.QUEUE.length == 0) {
            str += `재생목록에 곡이 없습니담... ('~ ')`;
        }
        else {
            for (let i = 0; i < this.QUEUE.length; i++) {
                str += `${i + 1}. ${this.QUEUE[i].snippet.title}\n\n`;
            }    
        }

        str += '```\n';

        Command.message.channel.send(str);
        return { requestSend : 1 };
    }

    repeat(Command) {
        let cmd = getCmd(Command.message.content);
        let arg = getArg(Command.message.content);

        let opt;

        if (cmd == arg) {
            if (this.REPEAT == 0) {
                opt = '반복 없음';
            } else if (this.REPEAT == 1) {
                opt = '전체 반복';
            } else if (this.REPEAT == 2) {
                opt = '한 곡 반복';
            }

            Command.message.channel.send(`현재 반복 모드는 \`[${opt}]\` 입니다. ㅇㅅㅇ`);
            return { requestSend : 1 };
        }

        let str = `\`[`;

        if (['0', 'off', '끄기', 'ㄲㄱ', '없음', 'ㅇㅇ'].includes(arg)) {
            str += `반복 없음`;
            opt = 0;
        } else if (['1', 'on', 'all', '전체', 'ㅈㅊ', '목록', 'ㅁㄹ'].includes(arg)) {
            str += `목록 반복`;
            opt = 1;
        } else if (['2', 'one', '한곡', '한 곡', 'ㅎㄱ', 'ㅎ ㄱ', '하나', 'ㅎㄴ'].includes(arg)) {
            str += `한 곡 반복`;
            opt = 2;
        } else {
            Command.message.channel.send(`다음 값 중에서 하나만 입력 가능합니다!\n\`\`\`끄기 (0, off) : 반복 없음\n전체 (1, on, all) : 전체 반복\n하나 (2, one) : 한 곡 반복\`\`\`\n사용법 : \`[반복 <모드>]\``);
            return { requestPending : true, requestSend : 1 };
        }

        str += `]\` 으로 설정되었습니다.`;

        this._setRepeat(opt);
        Command.message.channel.send(str);

        return { requestSend : 1 };
    }

    _setRepeat(repeat) {
        this.REPEAT = repeat;
    }

    skip(Command) {
        if (this.NOW_PLAYING) {
            this.DISPATCHER.end();
        }
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