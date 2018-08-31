// Xiaho Zin DDang Bot - Launch and Login
// by Hepheir, 2018
// remembering KimSuBin

'use strict';

///////////////////////////////////////

const API_Path = {
    Bot : 'bot/common/api/bot.json',
    Youtube : 'bot/common/api/youtube.json'
};

///////////////////////////////////////

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const events = require('events');
const eventEmitter = new events.EventEmitter();

///////////////////////////////////////

var CommandList = [];

// commandToolKit will be passed to the
// command actions to support their features.
var commandToolKit = {
    client : client,
    eventEmitter : eventEmitter,

    readJsonFile : readJsonFile,
    findCommand : findCommand,
    callCommand : callCommand,

    endCommand : endCommand,
    
    API_Path : API_Path
};

///////////////////////////////////////

function __main__() {
    client.once('ready', addMessageListener);

    client.on(`CommandStart`, removeMessageListener);
    client.on(`CommandEnd`, addMessageListener);

    clientLogin();
    console.log(commandToolKit);
}

function __messageListener__(Message) {
    if (!msg.guild)
        return;

    let Command = findCommand(Message);
    if (!Command)
        return;

    callCommand(Command.name);
}

///////////////////////////////////////

function clientLogin() {
    let BOT = readJsonFile(API_Path.Bot);
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


function addMessageListener() {
    client.on('message', __messageListener__);
}

function removeMessageListener() {
    client.removeListener('message', __messageListener__);
}


function findCommand(Message) {
    return CommandList.find(cmd => cmd.checkCondition(Message));
}

function callCommand(name) {
    eventEmitter.emit(`CommandStart`);
    eventEmitter.emit(`Command:${name}`, commandToolKit);
}

function endCommand() {
    eventEmitter.emit(`CommandEnd`);
}


///////////////////////////////////////

function readJsonFile(path) {
    let file = fs.readFileSync(path);
    return JSON.parse(file);
}

///////////////////////////////////////

__main__();