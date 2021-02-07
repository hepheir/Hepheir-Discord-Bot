module.exports = {
    name: 'pong',
    description: 'Pong!',
    usage: '',
    args: false,
    guildOnly: false,
    execute(message, args) {
        message.reply('Ping.');
    },
};