module.exports = {
    name: 'nibbong',
    description: '니뽕 내뽕!',
    aliases: ['니뽕내뽕', '맵크뽕', 'ㅁㅋㅃ', 'ㄴㅃㄴㅃ', '뽕크맵', '니뽕', '내뽕', '로뽕', '크뽕', '일저맵'],
    usage: '',
    cooldown: 3,
    args: false,
    guildOnly: false,
    execute(message, args) {
        const data = [
            '일요일 저녁 맵크뽕?',
            'https://www.youtube.com/watch?v=B2Fj23QXJvc'
        ];
        message.reply(data, { split: true });
    },
};