const events = require('events');

class MessageHandler {
    constructor(client) {
        this.client = client;
        this.eventEmitter = new events.EventEmitter();

        this.commandList = [];
        this.history = {
            list    : [],
            add     : this._addHistory,
            clear   : this._clearHistory
        };

        this.proceeding = false;

        // Binding
        this._main_MessageListener  = this._main_MessageListener.bind(this);
        this._assignCommandPackages = this._assignCommandPackages.bind(this);
        this._onCommandStart = this._onCommandStart.bind(this);
        this._onCommandEnd   = this._onCommandEnd.bind(this);
        this._findCommand    = this._findCommand.bind(this);

        // Init
        this._assignCommandPackages('help', 'friend');

        // Listener
        this.client.on('message', this._main_MessageListener);
        this.eventEmitter.on('commandStart', this._onCommandStart);
        this.eventEmitter.on('commandEnd',   this._onCommandEnd);
    }

    _assignCommandPackages() {
        Array.from(arguments).forEach(packname => {
            let cmdPackage = require(`../cmd/${packname}.js`);

            cmdPackage.forEach(c => {
                this.eventEmitter.on(`command:${c.name}`, c.action);
            });
            this.commandList = this.commandList.concat(cmdPackage);
        });
    }

    _main_MessageListener(Message) {
        console.log('onMessage');
        this.history.add(Message);
        
        let Command = this._findCommand(Message);
        if (Command && !this.proceeding) {
            this.eventEmitter.emit(`command:${Command.name}`, this);
        }
    }

    // Command Handling

    _findCommand(Message) {
        return this.commandList.find(item => item.isThis(Message));
    }

    _onCommandStart() {
        console.log('Command Started!');
        this.client.user.setStatus('idle');
        this.proceeding = true;
    }

    _onCommandEnd() {
        console.log('Command Ended!');
        this.client.user.setStatus('online');
        this.proceeding = false;
    }

    // History Handling
    _addHistory(Message) {
        this.list.unshift(Message);

        if (this.list.length > 10)
            this.list.pop();
    }
    
    _clearHistory() { this.list = []; }
}

module.exports = MessageHandler;