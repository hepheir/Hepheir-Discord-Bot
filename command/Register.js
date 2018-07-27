class Register {
    constructor() {
        this.init = this.init.bind(this)
        this.register = this.register.bind(this);
        this.init();

        // Insert Commands here
    }

    init() {
        this.Command = require('../src/Command.js');
        this.action = {
            list : new Array()
        }
    }

    register(name, option, onCommand = true, onChat = false, onMention = false, onBot = false) {
        if (!name) {
            throw 'Command.name must be given.';
        }
    
        let Cmd = new this.Command(name, option.action);
    
        for (let opt in option) {
            if (opt == 'subnames') {
                Cmd.subnames = Array.isArray(option.subnames) ?
                    option.subnames :
                    new Array();
            }
            else if (opt == 'action') {
                Cmd.action = typeof option.action === 'function' ?
                    option.action :
                    function() {};
            }
            Cmd[opt] = option[opt];
        }
    
        Cmd.condition.onCommand = onCommand;
        Cmd.condition.onChat    = onChat;
        Cmd.condition.onMention = onMention;
        Cmd.condition.onBot     = onBot;
    
        this.action.list.push(Cmd);
        return Cmd;
    }

    getAction(name) {
        return this.action.list.find(act => act.name === name);
    }
    
    rare(percentage) {
        return ( Math.floor(Math.random() * 101) - percentage ) <= 0;
    }
       
}

module.exports = Register;