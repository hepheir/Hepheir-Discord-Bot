module.exports = {
    name: 'github',
    description: 'Hepheir-Discord-Bot의 GitHub 관련 정보',
    aliases: ['git', 'repo', 'contribution', '깃허브', '깃헙', '깃', '레포', '레포지토리', 'update', '업데이트', '업뎃'],
    args: false,
    usage: '',
    cooldown: 3,
    guildOnly: false,
    execute(message, args) {
        const data = [
            "이 Bot은 Hepheir(hepheir@gmail.com)에 의해 제작되었습니다.",
            "",
            "https://github.com/Hepheir/Hepheir-Discord-Bot 에서 기여 하실 수 있습니다.",
            "Issue나 PR 보내주시면 적극 검토하겠습니다 :)",
        ];

        return message.channel.send(data, { split: true });
    },
};