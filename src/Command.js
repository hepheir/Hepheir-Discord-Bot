class Command {
    constructor(name) {
        // Init
        this.name = name;
        this.subnames = [];
        this.action = function() {};
        this.desc = '';

        // Var
        this.message = undefined;
        this.requestPending = false;
        this.requestCleaning = false;

        // Methods
        this.call = this.call.bind(this);
        this.isThis = this.isThis.bind(this);
        this.setAction = this.setAction.bind(this);
        this.addSubname = this.addSubname.bind(this);
        this.removeSubname = this.removeSubname.bind(this);
    }

    call(message) {
        this.message = message;
        
        let flag = this.action(this);

        if (flag != undefined) {
            this.requestPending = flag.requestPending != undefined;
            this.requestCleaning = Array.isArray(flag.requestCleaning) ? flag.requestCleaning : undefined;
            this.requestSend = (flag.requestSend > 0) ? flag.requestSend : 0;
        } else {
            this.requestPending = false;
            this.requestCleaning = undefined;
            this.requestSend = 0;
        }
        return this;
    }

    /**
     * Returns if this Command class should be called by given string.
     * @param {String} cmd 
     * @returns {Boolean}
     */
    isThis(cmd) {
        return this.name === cmd || this.subnames.includes(cmd);
    }

    setAction(call) {
        this.action = typeof call === 'function' ? call : function (cmd) { cmd.message.channel.send(cmd.desc) };
        return this;
    }

    addSubname(name) {
        if (Array.isArray(name)) {
            this.subnames = this.subnames.concat(name);
        } else {
            this.subnames.push(name);
        }
    }

    removeSubname(name) {
        this.subnames = this.subnames.filter(n => n !== name);
    }
}

module.exports = Command;