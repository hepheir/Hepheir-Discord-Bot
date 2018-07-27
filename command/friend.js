const Register = require('./Register.js');

class R extends Register {
    constructor() {
        super();

        this.register('김동주', {
            subnames: ['동주', 'Hepheir'],
            desc : undefined,
            action: Command => {
                let msg = Command.CommandHandler.history.list[0];

                if (this.rare(5)) {
                    msg.channel.send('*첨성대학교*');
                } else if (this.rare(5)) {
                    msg.channel.send('*https://github.com/Hepheir/Hepheir-Bot*');
                } else if (this.rare(20)) {
                    msg.channel.send('*신한 110-355-007102*');
                } else if (this.rare(20)) {
                    msg.channel.send('*010-2463-1852*');
                } else if (this.rare(20)) {
                    msg.channel.send('*석장동 840-2 201호*');
                }               
            }
        }, true, true);

        this.register('군인', {
            subnames: [
                '정태완', '태완',
                '오태영', '태영', '태영띠',
                '김민호', '민호', '호우', '민호우', '불꽃카리스마민호',
                '이용재', '용재', '용짜이'
            ],
            desc : undefined,
            action: Command => {
                if (!this.rare(40)) return;
        
                let msg = Command.CommandHandler.history.list[0];
        
                msg.channel.send('*군대* ㅠㅠ');
            }
        }, true, true);
        
        this.register('남창현', {
            subnames: [ '창현', '남창' ],
            desc : undefined,
            action: Command => {
                let msg = Command.CommandHandler.history.list[0];
        
                       if (this.rare(10)) {
                    msg.channel.send('*킹고 킹고 에스카라 킹고*');
                } else if (this.rare(15)) {
                    msg.channel.send('*선글라스가 잘 어울리는 그는...*');
                } else if (this.rare(20)) {
                    msg.channel.send('*"오늘 월식있다는데 보고 잘거냐?",\n\t\t"개기월식은 자주 있는 일이야" ~빛창현*');
                } else if (this.rare(25)) {
                    msg.channel.send('*"하지만 화성 친구도 옆에 있다는데",\n\t\t"그 친구는 매일 있어" ~빛창현*');
                } else if (this.rare(40)) {
                    msg.channel.send('*곧 군대로 떠나고 없을 사람입니다.* ㅠㅠ');
                }
            }
        }, true, true);
        
        this.register('정준환', {
            subnames: [ '준환', '17기계', 'fg'],
            desc : undefined,
            action: Command => {
                let msg = Command.CommandHandler.history.list[0];
        
                       if (this.rare(10)) {
                    msg.channel.send('*킹고 킹고 에스카라 킹고*');
                } else if (this.rare(15)) {
                    msg.channel.send('*Freshman Guide*');
                } else if (this.rare(25)) {
                    msg.channel.send('*17 기계 정준환*');
                }
            }
        }, true, true);
        
        this.register('김수빈', {
            subnames: [ '수빈', '김숩', '숩', '숩인', '숩인이' ],
            desc : undefined,
            action: Command => {
                let msg = Command.CommandHandler.history.list[0];
        
                       if (this.rare(5)) {
                    msg.channel.send('*머머리병사 김숩인, 충성충성!*');
                } else if (this.rare(15)) {
                    msg.channel.send('*지금쯤 열심히 현실배그 하고 있을 김숩..* ㅠㅠ');
                } else if (this.rare(20)) {
                    msg.channel.send('*김숩.. 그는 지금 빡빡이..* ㅠㅠ');
                } else if (this.rare(25)) {
                    msg.channel.send('*운전병 김숩이는 잘 지내고 있을까?*');
                } else if (this.rare(30)) {
                    msg.channel.send('*외로운 숩인이 여자친구 해주실 분 구합니다!* ㅠㅠ');
                } else if (this.rare(35)) {
                    msg.channel.send('*복오싶오 숩인아...* ㅠㅠ');
                } else if (this.rare(45)) {
                    msg.channel.send(`*Xiaho Zin DDang Can't Win*`);
                } else if (this.rare(10)) {
                    msg.channel.send('*이건 진짜 보기 힘든 메세지. 매우 낮은 확률의 메세지... 그치만 숩인이가 복오싶오..*');
                }
            }
        }, true, true);
        
        this.register('김주은', {
            subnames: [ '주은', '군만두', 'gunmandu', '아이스개', '대박삼건' ],
            desc : undefined,
            action: Command => {
                let msg = Command.CommandHandler.history.list[0];
        
                if (this.rare(0.01)) {
                    msg.channel.send('*좋냐고? 당연하지! ㅠㅠ*')
                        .then(MessageObject => {
                            setTimeout(() => {
                                MessageObject.delete();
                            }, 2000);
                        });
                }
            }
        }, true, true);
        
        this.register('공익', {
            subnames: [
                '오성준', '성준', '엉준',
                '오택현', '택현', '파섹현',
                '조제희', '제희',
                '김서기', '서기', '석이'
            ],
            desc : undefined,
            action: Command => {
                let msg = Command.CommandHandler.history.list[0];

                if (this.rare(33)) {
                    msg.channel.send('*키키키키킼..킹익* ㅎㅎ');
                } else if (this.rare(50)) {
                    msg.channel.send('*공익이지렁~* ㅎㅎ');
                }
            }
        }, true, true);
        
        this.register('이동재', {
            subnames: [ '동재', '베어루이', 'BearLoui' ],
            desc : undefined,
            action: Command => {
                if (!this.rare(60)) return;
                
                let msg = Command.CommandHandler.history.list[0];
        
                msg.channel.send('*갓 오브 더 엠페러 주모, 킹~ 동재*');
            }
        }, true, true);
        
        this.register('이진우', {
            subnames: [ '진우', '진우밥오' ],
            desc : undefined,
            action: Command => {
                let msg = Command.CommandHandler.history.list[0];
                
                if (this.rare(30)) {
                    msg.channel.send('^ *난쟁이 밥오...*');
                } else if (this.rare(30)) {
                    msg.channel.send('*진우 밥오...*');
                } else if (this.rare(40)) {
                    msg.channel.send('*...너 4이코패스냐?*');
                }
            }
        }, true, true);
        
        this.register('이민규', {
            subnames: ['민규', '좆규', '작규'],
            desc : undefined,
            action: Command => {
                let msg = Command.CommandHandler.history.list[0];
                
                if (this.rare(3)) {
                    msg.channel.send('*전화해줘~*');
                } else if (this.rare(15)) {
                    msg.channel.send('*히히*');
                } else if (this.rare(20)) {
                    msg.channel.send('*ㅋㅋ*');
                }
            }
        }, true, true);
         
        this.register('이정범', {
            subnames: [ '정범', '쥉범', '쥉쥉' ],
            desc : undefined,
            action: Command => {
                if (!this.rare(10)) return;
                
                let msg = Command.CommandHandler.history.list[0];
        
                msg.channel.send('*[**고**연전]은 즐거워.*');
            }
        }, true, true);
    }
}

let Re = new R;
module.exports = Re.action.list;