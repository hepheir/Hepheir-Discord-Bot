module.exports = {
    name: 'ping',
    description: 'Ping!',
    aliases: ['pong'],
    args: false,
    usage: '',
    cooldown: 3,
    guildOnly: false,
    execute(message, args) {
        switch (message.content.toLower()) {
            case 'pong':
                message.reply('Ping.');
                break;

            default:
                message.reply('Pong.');
                break
        }
    },
};