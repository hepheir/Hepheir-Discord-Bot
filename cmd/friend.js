const Command = require('../src/Command.js');

// Functions

function randomInt(MAX_VALUE) {
    return Math.floor( Math.random() * (MAX_VALUE + 1) );
}

const LIST = [
/* Commands
,
    new Command('', {
        subnames  : [],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        

        let R = randomInt(100);

            if (R < 10) Handler.send(``);
        else if (R < 20) Handler.send(``);
        else if (R < 30) Handler.send(``);
        else if (R < 40) Handler.send(``);
        else if (R < 50) Handler.send(``);
    })
*/
    new Command('김동주', {
        subnames  : ['동주', 'Hepheir'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R <  5) Handler.send(`*왜 불러?*`);
        else if (R < 20) Handler.send(`*찐땅 봇 깃허브 : https://github.com/Hepheir/Hepheir-Bot*`);
        else if (R < 35) Handler.send(`*와이?*`);
        else if (R < 55) Handler.send(`*요!*`);
        else if (R < 65) Handler.send(`*ㅎㅇ!*`);
        else if (R < 75) Handler.send(`*왜?*`);
    })
,
    new Command('김수빈', {
        subnames  : ['수빈', '김숩', '숩', '숩인', '숩인이'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R < 10) Handler.send(`*Xiaho Zin DDang Can't Win*`);
        else if (R < 20) Handler.send(`*머머리병사 김숩인, 충성충성!*`);
        else if (R < 30) Handler.send(`*지금쯤 열심히 현실배그 하고 있을 김숩..* ㅠㅠ`);
        else if (R < 40) Handler.send(`*김숩.. 그는 지금 빡빡이..* ㅠㅠ`);
        else if (R < 50) Handler.send(`*운전병 김숩이는 잘 지내고 있을까?*`);
        else if (R < 60) Handler.send(`*외로운 숩인이 여자친구 해주실 분 구합니다!* ㅠㅠ`);
        else if (R < 70) Handler.send(`*복오싶오 숩인아...* ㅠㅠ`);
    })
,
    new Command('남창현', {
        subnames  : ['창현', '남창', '빛창', '은빛매'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R < 10) Handler.send(`*킹고 킹고 에스카라 킹고*`);
        else if (R < 20) Handler.send(`*선글라스가 잘 어울리는 그는...*`);
        else if (R < 40) Handler.send(`*"오늘 월식있다는데 보고 잘거냐?",\n\t\t"개기월식은 자주 있는 일이야" ~빛창현*`);
        else if (R < 60) Handler.send(`*"하지만 화성 친구도 옆에 있다는데",\n\t\t"그 친구는 매일 있어" ~빛창현*`);
        else if (R < 70) Handler.send(`*곧 군대로 떠나고 없을 사람입니다.* ㅠㅠ`);
    })
,
    new Command('이정범', {
        subnames  : ['정범', '쥉범', '쥉쥉'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

        if (R < 10) Handler.send(`*[**고**연전]은 즐거워.*`);
    })
,
    new Command('이민규', {
        subnames  : ['민규', '좆규', '작규'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R <  5) Handler.send(`전화해줘`);
        else if (R < 25) Handler.send(`히히`);
        else if (R < 45) Handler.send(`ㅋㅋ`);
    })
,
    new Command('이진우', {
        subnames  : ['진우', '난쟁이'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R < 20) Handler.send(`^ *난쟁이 밥오...*`);
        else if (R < 40) Handler.send(`*진우 밥오...*`);
        else if (R < 60) Handler.send(`*...너 4이코패스냐?*`);
    })
,
    new Command('정찬빈', {
        subnames  : ['찬빈', '챈빈', '챈븬', '췐빈', '췐븬', 'raon찬밥', 'Raon찬밥', '찬밥'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R < 20) Handler.send(`*자칭 19학번 의대생*`);
        else if (R < 30) Handler.send(`*명 사...ㅁ수의 길...*`);
        else if (R < 40) Handler.send(`*팡운대*`);
        else if (R < 55) {
            Handler.eventEmitter.emit('commandStart');

            Handler.send('음...').then(msg1 => setTimeout(() => {
                msg1.edit(`*그는 좋*`).then(msg2 => setTimeout(() => {
                    msg2.edit(`*그는 좋...지많은 않은 삼수생이었습니다.*`);
                    Handler.eventEmitter.emit('commandEnd');
                }, 1000));
            }, 2000));
        }
    })
,
    new Command('이동재', {
        subnames  : ['동재', '베어루이', 'BearLoui'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R < 10) Handler.send(`*환상의 동꼬쇼, 지금 바로 시작합니다!*`);
        else if (R < 20) Handler.send(`*동드레드 = Science*`);
        else if (R < 50) Handler.send(`*갓 오브 더 엠페러 킹~ 동재*`);
    })
,
    new Command('김서기', {
        subnames  : ['서기', '석이', '김석'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R < 10) Handler.send(`*석...이...*`);
        else if (R < 20) Handler.send(`*석...2...*`);
        else if (R < 30) Handler.send(`*석...E...*`);
        else if (R < 40) Handler.send(`*석...Yee...*`);
        else if (R < 50) Handler.send(`*석...e...*`);
        else if (R < 60) Handler.send(`*서기모찌!*`);
    })
,
    new Command('정준환', {
        subnames  : ['준환', '17기계', 'fg', '정준한'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R <  5) Handler.send(`*주으으은환...*`);
        else if (R < 20) Handler.send(`*킹고 킹고 에스카라 킹고*`);
        else if (R < 35) Handler.send(`*훌라훌라 SKK*`);
        else if (R < 60) Handler.send(`*\`\`\`17 기계 정준환\`\`\`*`);
        else if (R < 75) Handler.send(`*Freshman Guide*`);
    })
,
    new Command('김주은', {
        subnames  : ['주은', '군만두', 'gunmandu', '아이스개', '대박삼건'],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(1000000);

        if (R < 1) Handler.send(`*좋냐고? 당연하지! ㅠㅠ*`).then(Message => {
            console.log(`...OMG`);
            setTimeout( () => Message.delete() );
        }, 2000);
        else {
            console.log(`...But failed`);
        }
    })
,
    new Command('군대', {
        subnames  : [
            '정태완', '태완',
            '오태영', '태영', '태영띠',
            '김민호', '민호', '호우', '민호우', '불꽃카리스마민호',
            '이용재', '용재', '용짜이'
        ],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R < 33) Handler.send(`*군대...* ㅠㅠ`);
        else if (R < 67) Handler.send(`*현실 배그...* ㅠㅠ`);
        else if (R < 99) Handler.send(`*아아... 호국요람으로...* ㅠㅠ`);
    })
,
    new Command('공익', {
        subnames  : [
            '오성준', '성준', '엉준',
            '오택현', '택현', '파섹현',
            '조제희', '제희'
        ],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Handler => {
        let R = randomInt(100);

             if (R < 33) Handler.send(`*키키키키킼..킹익* ㅎㅎ`);
        else if (R < 67) Handler.send(`*공익이지렁~* ㅎㅎ`);
        else if (R < 99) Handler.send(`*사회복무요원!*`);
    })
];

module.exports = LIST;