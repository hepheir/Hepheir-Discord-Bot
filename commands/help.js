module.exports = {
    name: 'help',
    description: '사용법을 안내해 드립니다.',
    aliases: ['commands', '도움', '도와줘', '헬프', '헲'],
    usage: '[command name]',
    args: false,
    guildOnly: false,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;
        const { prefix, cooldown } = require('../config.json');

        if (!args.length) {
            data.push('사용가능한 명령 목록:');
            data.push(commands.map(cmd => `\`${cmd.name}\``).join(', '));
        }
        else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
            
            if (!command) {
                return message.reply('that\'s not a valid command!');
            }
            
            data.push(`**Name:** ${command.name}`);
            
            if (command.aliases) data.push(`**Aliases:** ${command.aliases.map(cmd => `\`${cmd}\``).join(', ')}`);
            if (command.description) data.push(`**Description:** ${command.description}`);
            if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
            
            data.push(`**Cooldown:** ${command.cooldown || cooldown} second(s)`);
        }

        return message.channel.send(data, { split: true });
    },
};