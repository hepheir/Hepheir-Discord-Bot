const Command = require('./Command.js');


class CommandHandler {

constructor(Parent_CommandHandler) {
    // @static
    
    // @public
    this.history = {
        list    : new Array(),
        add     : this._addHistory,
        clear   : this._clearHistory
    };

    if (this.PARENT_COMMAND_HANDLER.history != undefined) {
        if (Array.isArray(this.PARENT_COMMAND_HANDLER.history.list)) {
            this.history.list = this.PARENT_COMMAND_HANDLER.history.list;
        }
    }

    // Bindings
    this.onMessage = this.onMessage.bind(this);

    this._addHistory   = this._addHistory.bind(this);
    this._clearHistory = this._clearHistory.bind(this);
}

get client() {
    return this.PARENT_COMMAND_HANDLER.client;
}


// Message Listener
onMessage(Message, Listener) {

    this.history.add(Message);
    
    let target = this.COMMAND_LIST.find(act => act.isThis(Message));
    if (target === undefined) return;

    let next = target.call(this);
    if (next) next(this);

    this.client.once('message', Listener);
}



} // Class End

module.exports = CommandHandler