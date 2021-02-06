module.exports = {
    name: 'ping',
    description: 'Ping!',
    args: false,
    usage: 'ping',
    cooldown: 5,
    guildOnly: false,
    execute(message, args) {
        message.reply('Pong.');
    },
};