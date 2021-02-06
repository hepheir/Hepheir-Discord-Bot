const fs = require('fs');
const yaml = require('js-yaml');

const Discord = require('discord.js');
const client = new Discord.Client();

const config = yaml.load(fs.readFileSync('config.yml'));

client.on('ready', () => {
    console.log(`Logged in as "${client.user.tag}"!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});

client.login(config.token);