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
        this.findCommand  = this.findCommand.bind(this);
        this.callCommand  = this.callCommand.bind(this);
        this.startCommand = this.startCommand.bind(this);
        this.endCommand   = this.endCommand.bind(this);

        this._main_MessageListener  = this._main_MessageListener.bind(this);
        this._assignCommandPackages = this._assignCommandPackages.bind(this);
        this._onCommandStart = this._onCommandStart.bind(this);
        this._onCommandEnd   = this._onCommandEnd.bind(this);

        // Init
        this._assignCommandPackages('friend', 'music', 'help');

        // Listener
        this.client.on('message', this._main_MessageListener);
        this.eventEmitter.on('commandStart', this._onCommandStart);
        this.eventEmitter.on('commandEnd',   this._onCommandEnd);
    }

    get lastMessage() {
        return this.history.list[0];
    }


    // Methods
    send(text) {
        if (!this.lastMessage) throw `No history`;

        return this.lastMessage.channel.send(text)
                   .then(Message => {
                       this.history.add(Message);
                       return Message;
                    });
    }

    findCommand(Message) {
        if (typeof Message === 'string')
            return this.commandList.find(item => item.name === Message);

        return this.commandList.find(item => item.isThis(Message));
    }

    callCommand(name) {
        this.eventEmitter.emit(`command:${name}`, this);
    }

    startCommand() {
        this.eventEmitter.emit('commandStart');
    }

    endCommand() {
        this.eventEmitter.emit('commandEnd');
    }


    // Helpers
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
        
        let Command = this.findCommand(Message);
        if (Command && !this.proceeding) {
            console.log(`Command called (${Command.name})`);
            this.callCommand(Command.name);
        }
    }


    // Command Handling

    _onCommandStart(text = '') {
        console.log('Command Started!', text);
        this.client.user.setStatus('idle');
        this.proceeding = true;
    }

    _onCommandEnd(text = '') {
        console.log('Command Ended!', text);
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