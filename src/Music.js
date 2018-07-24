const fs = require('fs');
const https = require('https');
const ytdl = require('ytdl-core');

const API = JSON.parse( fs.readFileSync("data/api_key.json") );


class Music {
    constructor() {
        this.VOICE_CHANNEL = undefined;
        this.DISPATCHER = undefined;
        this.VOLUME = undefined;
        this.QUEUE = [];
        this.REPEAT = 0;
        this.SEARCH_DATA = undefined;

        this.join = this.join.bind(this);
        this.leave = this.leave.bind(this);
        this.play = this.play.bind(this);
        this._playFromYoutube = this._playFromYoutube.bind(this);

        this.search = this.search.bind(this);
        this._searchFromYoutube = this._searchFromYoutube.bind(this);

        this.volume = this.volume.bind(this);
        this._setVolume = this._setVolume.bind(this);

        this.repeat = this.repeat.bind(this);
        this._setRepeat = this._setRepeat.bind(this);
    }

    join(msg) {
        if (!msg.member.voiceChannel) {
            msg.channel.send(`음성 채널에 먼저 접속한 뒤에 불러주세요. ㅎㅎ`);
            return;
        }
    
        this.VOICE_CHANNEL = msg.member.voiceChannel;

        msg.channel.send(`왔어요 왔어, 제가 왔습니다!`);
        return this.VOICE_CHANNEL.join();
    }

    leave(msg) {
        if (!this.VOICE_CHANNEL) return;
    
        let repeat = this.REPEAT;

        this.REPEAT = 0;
        this.VOICE_CHANNEL.leave();

        msg.channel.send(`지금 바로 나갑니다!`);

        this.REPEAT = repeat;
        this.VOICE_CHANNEL = undefined;
    }

    play(msg, triedAgain = false) {
        if (!this.VOICE_CHANNEL) {
            if (triedAgain) return;
    
            this.join(msg)
                .then(connection => { this.play(msg, true) });
        }

        let arg = getArg(msg);

        if (arg.match(/^https:\/\//)) {
            try {
                this._playFromYoutube(url);
            } catch(e) {console.log(e)}
        }
        else if (this.SEARCH_DATA) {
            let select = Number(arg);

            if (!select) {
                return;
            };

            let videoID = this.SEARCH_DATA.items[select - 1].id.videoId;
            console.log(JSON.stringify(this.SEARCH_DATA.items[select - 1]));

            if (!videoID) {
                return;
            }

            this._playFromYoutube(videoID);
            this.SEARCH_DATA = undefined;
        }
        else if (arg !== getCmd(msg)){
            this.search(msg);
        }
    }

    _playFromYoutube(videoID = '') {
        const stream = ytdl(videoID, { filter : 'audioonly' });

        this.DISPATCHER = this.VOICE_CHANNEL.connection.playStream(stream, {
            seek : 0,
            volume : this.VOLUME / 1000
        });

        this.DISPATCHER.on('end', () => {
            this.DISPATCHER = undefined;
        });
    }

    search(msg) {
        let query = getArg(msg);

        this._searchFromYoutube(query, () => {
            let str = '';
            let i, item;

            for (i = 0; i < this.SEARCH_DATA.items.length; i++) {
                item = this.SEARCH_DATA.items[i];
                str += `${i + 1}. ${item.snippet.title}\n`;
            }
            msg.channel.send(str);
        });
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

    volume(msg) {
        let vol = Number( getArg(msg) );

        if (0 < vol && vol <= 1000) {
            this._setVolume(vol);
            msg.channel.send(`볼륨값을 ${this.VOLUME}으로 설정완료.\n다음곡부터 적용됩니다! > <`);
        }
    }

    _setVolume(vol) {
        this.VOLUME = vol;
    }

    repeat(msg) {
        let rpt = getArg(msg);

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
    
/*

    
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
    
            str += `${i + 1}. ${source.title} [${source.length_seconds}seconds]\n`;
        }
        
        if (str === '') str = "재생목록에 곡이 없습니담... ('~ ')";
        msg.channel.send(str);
    }
    
    function _search(msg) {
        https.get(`https://www.googleapis.com/youtube/v3/search?part=id&q=`)
    }
*/
}

function getCmd(message) {
    if (!message.content.includes(' ')) {
        return message.content;
    } else {
        return message.content.split(' ')[0];
    }
}

function getArg(message) {
    if (!message.content.includes(' ')) {
        return message.content;
    } else {
        return message.content.slice(message.content.split(' ')[0].length + 1);
    }
}

module.exports = new Music();