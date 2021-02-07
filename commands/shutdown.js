const { exit } = require('process');
const { password } = require('../config.json');

module.exports = {
    name: 'shutdown',
    description: '김동주 봇을 잠시 저 세상으로 보냅니다.',
    aliases: ['강제종료'],
    usage: '[password]',
    args: true,
    guildOnly: false,
    cooldown: 30,
    reaction: "<:hepheir:806550414162001970>",
    execute(message, args) {
        if (args[0] == password) {
            exit(0);
        } else {
            message.reply('비밀번호가 틀립니다.');
        }
    },
};