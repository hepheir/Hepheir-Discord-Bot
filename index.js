const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

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

    const command = client.commands.get(commandName);
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