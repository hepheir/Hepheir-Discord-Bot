const Command = require('./Command.js');

class CommandHandler {
    constructor(CommandHandler) {
        // @public
        this.Client = CommandHandler.Client;
    
        // @static
        this.action = {
            list     : new Array(),
            register : this.register
        }
        
        // @public
        this.history = {
            list    : new Array(),
            add     : this._addHistory,
            clear   : this._clearHistory
        };

        if (CommandHandler.history != undefined) {
            if (Array.isArray(CommandHandler.history.list)) {
                this.history.list = CommandHandler.history.list;
            }
        }

        // Bindings
            this.onMessage = this.onMessage.bind(this);
            this.register  = this.register.bind(this);
            this.getAction = this.getAction.bind(this);

            this._addHistory   = this._addHistory.bind(this);
            this._clearHistory = this._clearHistory.bind(this);
    }

    // Message Listener
        onMessage(MessageObject) {
            this.history.add(MessageObject);

            let Action = this.action.list.find(act => act.condition.check(MessageObject));
            
            if (Action != undefined) {
                this.Client.user.setStatus('dnd');
                let nextAction = Action.call(this);
                
                if (nextAction) {
                    this.Client.user.setStatus('dnd');
                    nextAction(this);
                }
            }
            this.Client.user.setStatus('online');
        }

    // Command
        register(name, option, onCommand = true, onChat = false, onMention = false, onBot = false) {
            if (!name) {
                throw 'Command.name must be given.';
            }

            let Cmd = new Command(name, option.action);

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


    // History Handling
        _addHistory(MessageObject) {    
            return this.list.unshift(MessageObject);
        }
        
        _clearHistory() {
            this.list = new Array();
        }
}



module.exports = CommandHandler