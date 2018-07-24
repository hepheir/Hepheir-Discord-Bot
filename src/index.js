'use strict';

const fs = require('fs');


// DISCORD BOT

const API = JSON.parse( fs.readFileSync("data/api_key.json") );

const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`\n('-')/`);
    console.log(`${client.user.tag} 로 로그인에 성공!`);
    console.log(`초대 [https://discordapp.com/oauth2/authorize?client_id=${API.Discord.clientId}&scope=bot&permissions=108133440]`);
});

if (!API.Discord.token) throw `
Error! We cannot operate a bot without the token!
please enter your token @ data/api_key.json
`;
else client.login(API.Discord.token);


const CommandHandler = require('./CommandHandler.js');
const CmdHdr = new CommandHandler(client);

client.on('message', CmdHdr.onMessage);