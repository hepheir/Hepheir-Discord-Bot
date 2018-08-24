// Xiaho Zin DDang Bot - Command Object
// by Hepheir, 2018
// remembering KimSuBin

class Command {
    constructor(name, action, option) {
        checkValidProp(name, action, option);

        this.name = name;
        this.action = action;
        this.option = setDefaultOpt(option);

        this.call = this.call.bind(this);
    }

    call() {
        this.action();
    }
}

module.exports = Command;

function checkValidProp(name, action, option) {
    if (!name)
        throw `[Error] name is required.`;

    if (typeof name !== 'string')
        throw `[Error] name should be string. <typeof name: ${typeof name}>`;

    if (typeof action !== 'function')
        throw `[Error] action is not a function. <action: ${action}>`;
    
    return true;
}

function setDefaultOpt(option) {
    if (typeof option !== 'object')
        option = {};
    
    let { subnames, desc, condition } = option;

    if (Array.isArray(subnames))
        subnames = [];

    if (typeof desc !== 'string')
        desc = undefined;

    option.subnames = subnames;
    option.desc = desc;


    if (typeof condition !== 'object')
        condition = {};

    let { onCommand, onChat, onBot } = condition;

    if (typeof onCommand !== 'boolean')
        onCommand = true;

    if (typeof onChat !== 'boolean')
        onChat = false;

    if (typeof onBot !== 'boolean')
        onBot = false;

    condition.onCommand = onCommand;
    condition.onChat = onChat;
    condition.onBot = onBot;


    option.condition = condition;

    return option;
}