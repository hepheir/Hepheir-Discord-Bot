const Command = require('./Command.js');
const Music = require('./Music.js');

class CommandHandler {
    constructor(client) {
        // Var
        this.client = client;
        this.lastCmd = { isPending : false };

        this.history = [];
        this.reqCleaning = {
            send : 0,
            history : []
        };

        this.cmdList = [];

        // Methods
        this.init = this.init.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.register = this.register.bind(this);

        this.init();
    }

    // Registering Commands
    init() {
        this.register('노래', {
            subnames : ['ㄴㄹ', '재생', 'ㅈㅅ'],
            desc : "유튜브에서 노래를 찾아 재생합니다.",
            action : Music.music
        });

        // this.register('재생목록', {
        //     subnames : ['ㅈㅅㅁㄹ', '리스트', 'ㄹㅅㅌ'],
        //     desc : "현재 재생목록을 보여줍니다.",
        //     action : undefined
        // });

        this.register('검색', {
            subnames: ['ㄱㅅ'],
            desc: "유튜브에서 노래를 검색합니다.",
            action : Music.search
        });

        this.register('참가', {
            subnames: ['ㅊㄱ', '들어와', 'ㄷㅇㅇ', '이리로' , '이리와', 'ㅇㄹㅇ', '드루와', 'ㄷㄹㅇ', '컴'],
            desc: "음성 채널에 참가합니다.",
            action : Music.join
        });

        this.register('나가', {
            subnames: ['ㄴㄱ', '꺼져', 'ㄲㅈ'],
            desc: "접속중인 음성 채널에서 나갑니다.",
            action : Music.leave
        });

        this.register('볼륨', {
            subnames: ['ㅂㄹ'],
            desc: "노래의 볼륨을 설정합니다! : 1 ~ 1000 (재생중인 곡의 다음 곡부터 적용)",
            action : Music.volume
        });

        // this.register('다음', {
        //     subnames: ['ㄷㅇ'],
        //     desc: "재생목록의 다음 곡을 재생합니다.",
        //     action : undefined
        // });

        this.register('군인', {
            subnames: [
                '정태완', '태완',
                '김수빈', '수빈', '김숩', '숩', '숩인', '숩인이',
                '오태영', '태영', '태영띠',
                '김민호', '민호', '호우', '민호우', '불꽃카리스마민호',
                '이용재', '용재', '용짜이'
            ],
            desc : "우리의 소중한 친구들을 기억합니다.",
            action: Command => {
                Command.message.channel.send('*군대* ㅠㅠ');
            }
        });

        this.register('공익', {
            subnames: [
                '이민규', '민규', '좆규', '작민규', '작규',
                '김동주', '동주',
                '이동재', '동재', '베어루이', 'BearLoui',
                '이진우', '진우', '진우밥오',
                '오성준', '성준', '엉준',
                '오택현', '택현', '파섹현',
                '조제희', '제희',
                '김서기', '서기', '김석이', '석이'
            ],
            desc : "우리의 소중한 친구들을 기억합니다.",
            action: Command => {
                Command.message.channel.send('*키키키키킼..킹익* ㅎㅎ');
            }
        });

        this.register('도움말', {
            subnames: ['헬프', '헲', 'help', 'ㄷㅇㅁ', '도움', '?'],
            desc: "도움말을 보여줍니다.",
            action : Command => {
                // 탈출 코드
                if (Command.requestPending) {

                    this.lastCmd.requestPending = false;

                    if (!Command.isThis(getCmd(Command.message))) {
                        this.onMessage(this.history.shift());

                        return { requestCleaning : [1] };
                    }

                    return { requestPending : true };
                }
                let str = ''

                this.cmdList.forEach(Command => {
                    str += `**${Command.name}**`;
                    str += ` [\`${Command.subnames.join(', ')}\`]\n`;
                    str += `\`\`\`${Command.desc}\`\`\`\n`;
                })

                str += `\n*\`P.S. 아무거나 입력하면 사라집니다. (<도움말> 명령어를 입력하면 고정)\`*`;

                Command.message.channel.send(str);
                return { requestPending : true };
            }
        });
    }

    onMessage(msg) {
        // Remember last 5 messages
        this.history.unshift(msg);
        if (this.history.length > 5) this.history.pop();

        // Cleaning messages on demand. (if there is no pending send)
        if (this.reqCleaning.send > 0) {
            this.reqCleaning.send--;
            if (this.reqCleaning.send == 0) {
                console.log('start cleaning!', this.reqCleaning);
                this.reqCleaning.history.forEach(index => {
                    if (this.history[index]) this.history[index].delete();
                });
                this.reqCleaning.history = undefined;
            }
        }

        // Ignore messages from bot. (and PMs)
        if (!msg.guild || msg.author.bot) return;


        let Cmd;
        
        // check if the last command requested Pending-flag.
        if (this.lastCmd.requestPending) {
            Cmd = this.lastCmd;
        }
        else {
            let name = getCmd(msg);
            Cmd = this.cmdList.find(c => c.isThis(name));

            if (!Cmd) return;
        }

        this.lastCmd = Cmd.call(msg);
        
        // Cleaning messages on demand. (if there are pending sends, clean messages later, when it's time to do)
        if (Array.isArray(this.lastCmd.requestCleaning)) {
            console.log('requested to clean');

            if (this.lastCmd.requestSend > 0) {
                this.reqCleaning.send = this.lastCmd.requestSend;
                this.reqCleaning.history = this.lastCmd.requestCleaning;

                return;
            }
            
            this.lastCmd.requestCleaning.forEach(index => {
                if (this.history[index]) this.history[index].delete();
            });

            this.lastCmd.requestCleaning = undefined;
        }

        return;
    }

    /**
     * Register an instance of `Command` to `CommandHandler.cmdList`.
     * @param {String} name
     * @param {Object} option
     */
    register(name = "", option = { subnames : [], action : undefined, desc : "No description" }) {
        if (!name) {
            console.log("Command name must be given.");
            return;
        }

        let cmd = new Command(name);
        
        cmd.addSubname(option.subnames);
        cmd.setAction(option.action);
        cmd.desc = option.desc;

        this.cmdList.push(cmd);
        return cmd;
    }
}

function getCmd(message) {
    if (!message.content.includes(' ')) {
        return message.content;
    } else {
        return message.content.split(' ')[0];
    }
}

module.exports = CommandHandler;