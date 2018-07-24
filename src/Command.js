class Command {
    constructor(name) {
        // Init
        this.name = name;
        this.subnames = [];
        this.action = function() {};
        this.desc = '';

        // Var
        this.message = undefined;
        this.isPending = false;

        // Methods
        this.call = this.call.bind(this);
        this.isThis = this.isThis.bind(this);
        this.setAction = this.setAction.bind(this);
        this.addSubname = this.addSubname.bind(this);
        this.removeSubname = this.removeSubname.bind(this);
    }

    call(message) {
        this.message = message;
        this.isPending = this.action(this) != undefined;
        return this;
    }

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