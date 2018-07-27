'use strict';


// DISCORD BOT

const fs = require('fs');
const Discord = require('discord.js');

const API = JSON.parse( fs.readFileSync("data/api_key.json") );
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


// MAIN

const MessageHandler = require('./MessageHandler.js');

const messageHandler = new MessageHandler(client);

client.once('message', messageHandler.onMessage);



/**
 * Client.user.setStatus()
 * : PresenceStatus
 * - online : 초록. 대기중
 * - idle   : 노랑. 명령 실행중
 * - dnd    : 빨강. 입력을 기다리는 중
 */