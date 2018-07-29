const Command = require('../src/Command.js');

LIST = [
/* Commands
,
    new Command('', {
        subnames  : [],
        condition : {
            onCommand : true,
            onChat    : true,
            onBot     : false
        }
    }, Command => {
        function send(text) { return Command.history.list[0].channel.send(text); }

        let R = randomInt(100);

            if (R < 10) send(``);
        else if (R < 20) send(``);
        else if (R < 30) send(``);
        else if (R < 40) send(``);
        else if (R < 50) send(``);
    })
*/
new Command('도움말', {
        subnames  : ['헬프', '헲', 'help', 'ㄷㅇㅁ', '도움', '?'],
        desc      : "도움말을 보여줍니다.",
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
}, Handler => {
    function send(text) {
        return Handler.history.list[0].channel.send(text);
    }

    Handler.startCommand();

    let content = '';

    content += `**Bojeong Univ.**`;
    content += ` [\`친구들의 이름\`]\n`;
    content += `\`\`\`일정한 확률로 문구가 출력되기도 합니다.\`\`\`\n`;

    Handler.commandList.forEach(cmd => {
        if (cmd.option.desc === undefined) return;

        content += `**${cmd.name}**`;
        content += ` [\`${cmd.option.subnames.join(', ')}\`]\n`;
        content += `\`\`\`${cmd.option.desc}\`\`\`\n`;
    })

    content += `\n*\`P.S. 아무거나 입력하면 사라집니다.\`*`;

    send(content).then(helpMessage => {
        Handler.client.once('message', userMessage => {
            helpMessage.delete();
            Handler.endCommand;
        })
    });
})
];

module.exports = LIST;