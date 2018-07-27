class Command {
    constructor(name, action) {
        // Init
        this.name = name;
        this.subnames = [];
        this.desc = '';

        if (typeof action !== 'function') {
            throw `Error, ${action} is not a function`;
        }

        this.action = function() {};


        // Condition for this Command to be called : 호출 조건
        this.condition = {
            this      : this, // to fix `this`
            onCommand : true,
            onChat    : false,
            onMention : false,
            onBot     : false,
            check     : this._checkCondition
        };

        // Var
        this.CommandHandler = undefined;

        // Bindings
            this.call = this.call.bind(this);
            this._checkCondition = this._checkCondition.bind(this);
    }

    call(CommandHandler) {
        this.CommandHandler = CommandHandler;

        return this.action(this);
    }

    // Helpers

    _checkCondition(MessageObject) {
        let that = this.this;
        

        if (!that.condition.onBot) {
            if (MessageObject.author.bot)
                return false;
        }

        let cmd = MessageObject.content.includes(' ') ?
                MessageObject.content.split(' ')[0] :
                MessageObject.content;

        if (that.condition.onChat) {
            if (MessageObject.content.includes(that.name)) {
                return true;
            }
            
            if (that.subnames.find(subname => MessageObject.content.includes(subname))) {
                return true;
            }
        }

        if (that.condition.onMention) {
            // To Do
        }

        if (that.condition.onCommand) {
            if (that.name == cmd || that.subnames.includes(cmd))
                return true;
        }

        return false;
    }
}

module.exports = Command;