'use strict';

class Command {

constructor(name, option, action) {
    // Init
    if (!name) throw `Error: name is required.`;
    if (typeof action !== 'function') throw `Error, ${action} is not a function`;

    this.name     = name;
    this.action   = action;

    this.option = {
        subnames  : new Array(),
        desc      : undefined,
        // Conditions for this Command to be called : 호출 조건
        condition : {
            onCommand : true,
            onChat    : false,
            onBot     : false
        }
    };

    // Bindings
    this.isThis = this.isThis.bind(this);
    this.applyOptions = this.applyOptions.bind(this);

    this.applyOptions(option);
}

isThis(Message) {
    let { option, name } = this;
    let { subnames, condition } = option;
    let text = Message.content;

    let isBot = Message.author.bot;
    if (!condition.onBot && isBot ) return false;

    let calledByName    = text.includes(name);
    let calledBySubname = subnames.find(sn => text.includes(sn));
    if ( condition.onChat && (calledByName || calledBySubname) ) return true;
    
    let commandCalled = text.startsWith(name) ||
                        subnames.find(sn => text.startsWith(sn));
    if ( condition.onCommand && commandCalled ) return true;

    return false;
}

applyOptions(newOption) {
    let { subnames, condition } = newOption;
    if (!Array.isArray(subnames)) throw `Error : subnames is not Array`;

    newOption.condition = {
        onCommand : condition.onCommand || true,
        onChat    : condition.onChat    || false,
        onBot     : condition.onBot     || false
    };

    this.option = newOption;
}

} // Class End

module.exports = Command;