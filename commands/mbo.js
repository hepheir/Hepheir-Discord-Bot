module.exports = {
    name: 'mbo',
    description: '민뱅온을 달아드립니다. 명령어 뒤에 \'크게\'를 붙이면 더 커집니다.',
    aliases: ['민뱅온', 'ㅁㅂㅇ', '김민호', '민호', '마이노', 'mino', 'ㅁㅇㄴ'],
    usage: "['크게', 'big', 'large', '짱크게', '짱커', '짱']",
    args: false,
    guildOnly: false,
    execute(message, args) {
        const reaction = '<a:ko_MBO:806550357823848448>';
        const arguments = ['크게', 'big', 'large', '짱크게', '짱커', '짱'];
        
        if (args.length && arguments.includes(args[0])) {
            message.channel.send(reaction);
        } else {
            message.react(reaction);
        }
    },
};