// Xiaho Zin DDang Bot - Launch and Login
// by Hepheir, 2018
// remembering KimSuBin

'use strict';

///////////////////////////////////////

const API_Bot_Path = '../common/api/bot.json';

///////////////////////////////////////

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const events = require('events');
const eventEmitter = new events.EventEmitter();

///////////////////////////////////////

var Brains = {
    //
};

///////////////////////////////////////

function __main__() {
    clientLogin();

    client.once('ready', () => {
        //
    });
}

///////////////////////////////////////

function clientLogin() {
    let BOT = readJsonFile(API_Bot_Path);
    if (!BOT.token) throw `
Error! Could not login because the token was not given!
please enter your token @ [bot/common/api/bot.json]`;
    
    
    client.login(BOT.token);
    client.on('ready', () => { console.log(`
('-')/ Yo!
Successfully logged in as [${client.user.tag}]!

You can invite [${client.user.tag}] on this url.
[https://discordapp.com/oauth2/authorize?client_id=${BOT.clientId}&scope=bot&permissions=108133440]`);

    });
}


function __commandRegistry__() {

}

///////////////////////////////////////

function readJsonFile(path) {
    let file = fs.readFileSync(path);
    return JSON.parse(file);
}

///////////////////////////////////////

__main__();