// Xiaho Zin DDang Bot - launch and login

const bot_path = '../common/api/bot.json';


'use strict';

const fs = require('fs');
const Discord = require('discord.js');


function parseJsonFile(path) {
    let file = fs.readFileSync(path);
    return JSON.parse(file);
}


const client = new Discord.Client();

const BOT = parseJsonFile(bot_path);

if (!BOT.token) throw `
Error! Could not login because the token was not given!
please enter your token @ [bot/common/api/bot.json]`;


client.login(BOT.token);
client.on('ready', () => {
///////////////////////////////////////
console.log(`
('-')/ Yo!
Successfully logged in as [${client.user.tag}]!

You can invite [${client.user.tag}] on this url.
[https://discordapp.com/oauth2/authorize?client_id=${BOT.clientId}&scope=bot&permissions=108133440]`);
///////////////////////////////////////
});

module.exports = client;