const Register = require('./Register.js');

const fs = require('fs');
const https = require('https');
const ytdl = require('ytdl-core');

const API = JSON.parse( fs.readFileSync("data/api_key.json") );

class R extends Register {
    constructor() {
        super();
        //
        this.VOICE_CHANNEL = undefined;
        this.DISPATCHER    = undefined;
        this.QUEUE = new Array();

        this.VOLUME = 100;

        this.MAX_VOLUME = 1000;
        this.MAX_SEARCH = 7;

    // Bindings
        this.searchFromYT = this.searchFromYT.bind(this);
        this.r_Music  = this.r_Music.bind(this);
        this.r_Search = this.r_Search.bind(this);
        this.r_Join   = this.r_Join.bind(this);
        this.r_Leave  = this.r_Leave.bind(this);

    // Commands
        this.register('노래', {
            subnames: [ 'ㄴㄹ' ],
            desc : '유튜브에서 노래를 검색하거나, url을 직접 입력하여 재생합니다.',
            action: this.r_Music
        }, true, false);

        
        this.register('검색', {
            subnames: [ ],
            desc : undefined,
            action: this.r_Search
        }, true, false);

        this.register('재생', {
            subnames: [ ],
            desc : undefined,
            action: Command => {
                let Ch = Command.CommandHandler;

                if (!this.VOICE_CHANNEL) {
                    this.getAction('참가').call(Command.CommandHandler);
                }

                let videoId = this.QUEUE[0].id.videoId;

                const stream = ytdl(videoId, { filter : 'audioonly' });

                this.DISPATCHER = this.VOICE_CHANNEL.connection.playStream(stream, {
                    seek : 0,
                    volume : this.VOLUME / this.MAX_VOLUME
                });

                Ch.Client.user.setPresence({ game: { name: `${this.QUEUE[0].snippet.title}` }, status: 'idle' });

                
            }
        }, true, false);


        this.register('참가', {
            subnames: ['ㅊㄱ', '이리와', 'ㅇㄹㅇ', '들어와', 'ㄷㅇㅇ', '드루와', 'ㄷㄹㅇ'],
            desc : '찐땅봇이 음성 채널에 접속합니다.',
            action: this.r_Join
        }, true, false);


        this.register('나가기', {
            subnames: ['ㄴㄱㄱ', 'ㄴㄲ', '나가', 'ㄴㄱ'],
            desc : '찐땅봇이 음성 채널에서 퇴장합니다.',
            action: this.r_Leave
        }, true, false);
    }

    // Methods
    
    r_Music(Command) {
        let MessageObject = Command.CommandHandler.history.list[0];

        let url = MessageObject.content.match(/^https:\/\//);
        if (url) {

        }

        this.getAction('검색').call(Command.CommandHandler);
    }

    r_Search(Command) {
        // Parse search query
        let MessageObject = Command.CommandHandler.history.list[0];

        let query;

        if (!MessageObject.content.includes(' ')) {
            query = MessageObject.content;
        } else {
            let cmdPart = MessageObject.content.split(' ')[0];
            query = MessageObject.content.slice(cmdPart.length + 1);
        }

        // Search from Youtube
        this.searchFromYT(query)
        .catch(err => {
            console.log('(searchFromYT : music.js, 1)', err);
            return undefined;
        })
        // User select
        .then(SEARCH_DATA => {
            if (!SEARCH_DATA) return;
            
            let Ch = Command.CommandHandler;

            // Print found items
            let str = '```';
    
            let i, item;
            for (i = 0; i < SEARCH_DATA.items.length; i++) {
                item = SEARCH_DATA.items[i];
                str += `${i + 1}. ${item.snippet.title}\n\n`;
            }
    
            str += '```\n';
            str += `[곡 번호] 로 선택해 주세요. (취소하려면 [취소])`;
    
            MessageObject.channel.send(str)
        // Get input
            .then(itemList_Message => {
                let listener = userSel_Message => {
                    // Remove item list
                    itemList_Message.delete();

                    let i = userSel_Message.content.match(/(1|2|3|4|5|6|7|8|9)+/g);
                    if (!i) {
                        userSel_Message.channel.send('취소되었습니다.');
                    }
                    else {
                        userSel_Message.delete();
                        let item = SEARCH_DATA.items[parseInt(i[0]) - 1];

                        this.QUEUE.push(item);
                        userSel_Message.channel.send(`재생목록에 곡이 추가되었습니다.\n\`\`\`${item.snippet.title}\`\`\``);

                        // ////////////////
                        if (this.QUEUE.length == 1)
                            this.getAction('재생').call(Command.CommandHandler);
                        ///////////////////
                    }
                }

                Ch.Client.once('message', listener);
            })
        })
    }

    r_Join(Command) {
        let Ch = Command.CommandHandler;
        let MessageObject = Ch.history.list[0];

        if (!MessageObject.member.voiceChannel) {
            MessageObject.channel.send(`음성 채널에 먼저 접속한 뒤에 불러주세요. ㅎㅎ`);
            return;
        }

        this.VOICE_CHANNEL = MessageObject.member.voiceChannel;
        this.VOICE_CHANNEL.join();

        MessageObject.channel.send(`왔어요 왔어, 제가 왔습니다!`);
    }

    r_Leave(Command) {
        let Ch = Command.CommandHandler;
        
        if (!this.VOICE_CHANNEL) return;
    
        let repeat = this.REPEAT;

        this.REPEAT = 0;
        this.VOICE_CHANNEL.leave();

        Ch.history.list[0].channel.send(`지금 바로 나갑니다!`);

        this.REPEAT = repeat;
        this.VOICE_CHANNEL = undefined;
    }

    searchFromYT(query) {
        let url = `https://www.googleapis.com/youtube/v3/search?key=${API.Youtube.key}&part=snippet&q=${encodeURIComponent(query)}&maxResults=${this.MAX_SEARCH}`;

        return new Promise(((resolve, reject) => {
            https.get(url, response => {
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


}

let Re = new R;
module.exports = Re.action.list;