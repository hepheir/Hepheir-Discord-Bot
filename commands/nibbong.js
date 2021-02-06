module.exports = {
    name: 'nibbong',
    description: '니뽕 내뽕!',
    aliases: ['니뽕내뽕', '맵크뽕', 'ㅁㅋㅃ', 'ㄴㅃㄴㅃ', '뽕크맵'],
    args: false,
    usage: '',
    cooldown: 3,
    guildOnly: false,
    execute(message, args) {
        const data = [];
        data.push('일요일 저녁 맵크뽕?');
        data.push('https://www.youtube.com/watch?v=B2Fj23QXJvc');
        message.reply(data, { split: true });
    },
};