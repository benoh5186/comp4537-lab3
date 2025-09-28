


class StringUtility {
    static getDate() {
        return new Date().toString();
    }

    static formatMessage(message, ...args) {
        return message.replace(/%(\d+)/g, (_, number) => {
            return args[number - 1]
        })
    }
}

module.exports = StringUtility
