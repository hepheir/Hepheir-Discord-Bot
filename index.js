const fs = require('fs');
const Discord = require('discord.js');
const { prefix, cooldown, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

// Loads commands from './commands'
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Parses messages
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    console.log(`${message.author.username}님이 \`${command.name}\`명령을 호출하였습니다.`);

    // If arguments are insufficient
    if (command.args && !args.length) {
        let reply = `명령이 완전하지 않습니다!`;
        if (command.usage) {
            reply += `\n이 명령의 올바른 사용방법은 다음과 같습니다: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.reply(reply);
    }

    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || cooldown) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`\`${command.name}\` 명령을 사용하려면 ${timeLeft.toFixed(1)}초 더 기다려야 합니다.`)
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // If guild-only command
    if (command.guildOnly && !message.channel.type === 'dm') {
        return message.reply(`이 명령은 서버에서만 사용 가능합니다!`);
    }

    // Adds reaction to the command
    if (command.reaction) {
        message.react(command.reaction);
    }

    // Execute command
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('이 명령을 실행하는 중 문제가 발생했습니다!');
    }
});

// To ready client
client.on('ready', () => {
    console.log(`Logged in as "${client.user.tag}"!`);
});

client.login(token);