'use strict';

const fs = require('fs');


// DISCORD BOT

const API = JSON.parse( fs.readFileSync("data/api_key.json") );

const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`${client.user.tag}로 로그인에 성공!`);
});

if (!API.Discord.token) throw `
Error! We cannot operate a bot without the token!
please enter your token @ data/api_key.json
`;
else client.login(API.Discord.token);