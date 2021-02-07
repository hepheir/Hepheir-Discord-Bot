module.exports = {
    name: 'ping',
    description: 'Ping!',
    usage: '',
    args: false,
    guildOnly: false,
    execute(message, args) {
        message.reply('Pong.');
    },
};