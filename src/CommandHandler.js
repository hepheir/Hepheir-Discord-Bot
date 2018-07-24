const Command = require('./Command.js');

const Music = require('./Music.js');

class CommandHandler {
    constructor(client) {
        this.client = client;
        this.lastCmd = { isPending : false };

        this.list = [];

        this.onMessage = this.onMessage.bind(this);
        this.register = this.register.bind(this);

        // Registering Commands
        this.register('노래', {
            subnames : ['ㄴㄹ'],
            desc : "유튜브에서 노래를 찾아 재생합니다."
        });

        this.register('재생목록', {
            subnames : ['ㅈㅅㅁㄹ', '리스트', 'ㄹㅅㅌ'],
            desc : "현재 재생목록을 보여줍니다."
        });

        this.register('재생', {
            subnames: ['ㅈㅅ'],
            desc: "노래를 재생합니다."
        });

        this.register('검색', {
            subnames: ['ㄱㅅ'],
            desc: "유튜브에서 노래를 검색합니다."
        });

        this.register('참가', {
            subnames: ['컴', 'ㅊㄱ', '들어와', 'ㄷㅇㅇ', '이리로' , '이리와', 'ㅇㄹㅇ', '드루와', 'ㄷㄹㅇ'],
            desc: "음성 채널에 참가합니다."
        });

        this.register('나가', {
            subnames: ['ㄴㄱ', '꺼져', 'ㄲㅈ'],
            desc: "접속중인 음성 채널에서 나갑니다."
        });

        this.register('볼륨', {
            subnames: ['ㅂㄹ'],
            desc: "노래의 볼륨을 설정합니다! : 1 ~ 1000 (재생중인 곡의 다음 곡부터 적용)"
        });

        this.register('다음', {
            subnames: ['ㄷㅇ'],
            desc: "재생목록의 다음 곡을 재생합니다."
        });

        this.register('군인', {
            subnames: [
                '정태완', '태완',
                '김수빈', '수빈', '김숩', '숩',
                '오태영', '태영', '태영띠',
                '김민호', '민호', '호우', '민호우', '불꽃카리스마민호',
                '이용재', '용재', '용짜이'
            ],
            action: cmd => {
                cmd.message.channel.send('*군대* ㅠㅠ');
            },
            desc : "현재 재생목록을 보여줍니다."
        });

        this.register('도움말', {
            subnames: ['헬프', '헲', 'help', 'ㄷㅇㅁ', '도움', '?'],
            desc: "도움말을 보여줍니다."
        });
    }

    onMessage(msg) {
        // Ignore messages from bot. (and PMs)
        if (!msg.guild || msg.author.bot) return;


        let Cmd;
        
        if (this.lastCmd.isPending) {
            Cmd = this.lastCmd;
            Cmd.isPending = false;

        }
        else {
            let name;
            if (!msg.content.includes(' ')) {
                name = msg.content;
            } else {
                name = msg.content.split(' ')[0];
            }
            Cmd = this.list.find(c => c.isThis(name));

            if (!Cmd) return;
        }

        this.lastCmd = Cmd.call(msg);
        return;
    }

    register(name = "", option = { subnames : [], action : undefined, desc : "No description" }) {
        if (!name) {
            console.log("Command name must be given.");
            return;
        }

        let cmd = new Command(name);
        
        cmd.addSubname(option.subnames);
        cmd.setAction(option.action);
        cmd.desc = option.desc;

        this.list.push(cmd);
        return cmd;
    }
}



// function getCmd(message) {
//     if (!message.content.includes(' ')) {
//         return message.content;
//     } else {
//         return message.content.split(' ')[0];
//     }
// }

// function getArg(message) {
//     if (!message.content.includes(' ')) {
//         return message.content;
//     } else {
//         return message.content.slice(message.content.split(' ')[0].length + 1);
//     }
// }

module.exports = CommandHandler;