const Music = require('./Music.js');

class Command {
    constructor() {
        this.list = [
            {
                name: '노래',
                subnames: ['ㄴㄹ'],
                action: Music.play,
                desc: "유튜브에서 노래를 찾아 재생합니다."
            },
            {
                name: '재생목록',
                subnames: ['ㅈㅅㅁㄹ', '리스트', 'ㄹㅅㅌ'],
                action: () => {},
                desc: "현재 재생목록을 보여줍니다."
            },
            {
                name: '재생',
                subnames: ['ㅈㅅ'],
                action: () => {},
                desc: "노래를 재생합니다."
            },
            // vvv 나중에 빼야하는 것 vvv
            {
                name: '검색',
                subnames: ['ㄱㅅ'],
                action: Music.search,
                desc: "유튜브에서 노래를 검색합니다."
            },
            // ^^^ 나중에 빼야하는 것 ^^^
            {
                name: '참가',
                subnames: ['컴', 'ㅊㄱ', '들어와', 'ㄷㅇㅇ', '이리로' , '이리와', 'ㅇㄹㅇ', '드루와', 'ㄷㄹㅇ'],
                action: Music.join,
                desc: "음성 채널에 참가합니다."
            },
            {
                name: '나가',
                subnames: ['ㄴㄱ', '꺼져', 'ㄲㅈ'],
                action: Music.leave,
                desc: "접속중인 음성 채널에서 나갑니다."
            },
            {
                name: '볼륨',
                subnames: ['ㅂㄹ'],
                action: () => {},
                desc: "노래의 볼륨을 설정합니다! : 1 ~ 1000 (재생중인 곡의 다음 곡부터 적용)"
            },
            {
                name: '다음',
                subnames: ['ㄷㅇ'],
                action: () => {},
                desc: "재생목록의 다음 곡을 재생합니다."
            },
            {
                name: '군인',
                subnames: [
                    '정태완', '태완',
                    '김수빈', '수빈', '김숩', '숩',
                    '오태영', '태영', '태영띠',
                    '김민호', '민호', '호우', '민호우', '불꽃카리스마민호',
                    '이용재', '용재', '용짜이'
                ],
                action: msg => {
                    msg.channel.send('*군대* ㅠㅠ');
                },
                desc: "우리의 소중한 친구들을 기억합니다."
            },
            {
                name: '도움말',
                subnames: ['헬프', '헲', 'help', 'ㄷㅇㅁ', '도움', '?'],
                action: () => {},
                desc: "도움말을 보여줍니다."
            }
        ];

        this.register = this.register.bind(this);
        this.call = this.call.bind(this);
    }

    register(name = "", subnames = [], action = function(){}, desc = "No description") {
        if (!name) {throw "Command name must be given.";}

        let cmdObject = {
            name: name,
            subnames: subnames,
            action: action,
            desc: desc
        };

        this.list.push(cmdObject);
        return cmdObject;
    }

    call(msg) {
        let name = getCmd(msg);

        if (!name) {throw "Name must be given"}

        this.list.find(cmdObj => {
            if (cmdObj.name === name || cmdObj.subnames.includes(name)) {
                cmdObj.action(msg);
                console.log("command called!", name);
            }
        });
    }
    
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

module.exports = new Command();