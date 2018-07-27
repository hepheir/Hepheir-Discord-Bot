const CommandHandler = require('./CommandHandler.js');

// @public
var Inquiry = undefined;

class MessageHandler extends CommandHandler {
    constructor(Client) {
        super({ Client : Client });

        const commandPackages = ['friend', 'music'];

        commandPackages.forEach(pack => {
            this.action.list = this.action.list.concat(require(`../command/${pack}.js`));
        });

        this.register('도움말', {
            subnames: ['헬프', '헲', 'help', 'ㄷㅇㅁ', '도움', '?'],
            desc: "도움말을 보여줍니다.",
            action : Command => {
                let Ch = Command.CommandHandler;

                let str = ''

                Ch.action.list.forEach(Command => {
                    if (Command.desc === undefined)
                        return;

                    str += `**${Command.name}**`;
                    str += ` [\`${Command.subnames.join(', ')}\`]\n`;
                    str += `\`\`\`${Command.desc}\`\`\`\n`;
                })

                str += `\n*\`P.S. 아무거나 입력하면 사라집니다. (<도움말> 명령어를 입력하면 고정)\`*`;

                Ch.history.list[0].channel.send(str)
                    .then(MessageObject => Ch.history.add(MessageObject))
                    .then(() => {
                        Ch.Client.once('message', MessageObject => {
                            if (!Command.condition.check(MessageObject)) {
                                Ch.history.list[1].delete();
                            }
                        });
                    });  
            }
        }, true, false);

        // Binding
            this.startMessage = this.startMessage.bind(this);
        // Listener
        this.Client.on('message', this.startMessage);
    }    

    startMessage(MessageObject) {
        if (this.Client.user.presence.status != 'online')
            return;

        this.onMessage(MessageObject);

    }
}

module.exports = MessageHandler;