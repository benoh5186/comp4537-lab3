const http = require("http");
const url = require("url");
const fs = require("fs");
const StringUtility = require("./modules/utils.js")
const {USER_MESSAGES, API_ENDPOINTS} = require("./lang/en/en.js")


const getDate = API_ENDPOINTS.GET_DATE
const readFile = API_ENDPOINTS.READ_FILE
const writeFile = API_ENDPOINTS.WRITE_FILE
const html_content = USER_MESSAGES.HEADER.HTML_CONTENT


class Server {
    constructor(port) {
        this.port = port
        this.server = http.createServer(
            (req, res) => {
                API.handleRequest(req, res);
            }
        )
    }
    start() {
        this.server.listen(this.port)
    }
}

class API {

    static handleRequest(req, res) {
        const url_parsed = url.parse(req.url, true);
        const path = url_parsed.pathname;
        switch(path) {
            case getDate:
                API.handleGetDate(url_parsed, res)
                break;
            case readFile:
                API.handleReadFile(url_parsed, res)
                break;
            case writeFile:
                API.handleWriteFile(url_parsed, res)
                break;
            default:
                res.writeHead(404, {"Content-Type" : html_content});
                res.write(USER_MESSAGES.ERROR.ENDPOINT_NOT_FOUND)
                res.end();
        }
    }
    static handleReadFile(url_parsed, res) {
        const query = url_parsed.query;
        const fileName = query.fileName;
        fs.readFile(fileName, "utf-8", (err, data) => {
            if (err) {
                const formatted_message = StringUtility.formatMessage(USER_MESSAGES.ERROR.FILE_NOT_FOUND, err, fileName)
                res.writeHead(404, {"Content-Type" : html_content});
                res.write(formatted_message);
                res.end();
            } else {
                const formatted_message = StringUtility.formatMessage(USER_MESSAGES.SUCCESS.RES_DISPLAY_FILE_DATA, data)
                res.writeHead(200, {"Content-Type" : html_content});
                res.write(formatted_message)
                res.end();
            }

        })
    
    }
    static async handleWriteFile(url_parsed, res) {
        const query = url_parsed.query;
        const fileName = USER_MESSAGES.FILE;
        const data = `\n ${query.text}`
        fs.appendFile(fileName, data, (err) => {
            if (err) {
                res.writeHead(404, { "Content-Type" : html_content})
                res.write(USER_MESSAGES.ERROR.FILE_NOT_WRITTEN);
                res.end();
            } else {
                const formatted_message = StringUtility.formatMessage(USER_MESSAGES.SUCCESS.SUCCESS_WRITTEN, query.text)
                res.writeHead(200, {"Content-Type" : html_content});
                res.write(formatted_message);
                res.end();
            }
        });
        

    }

    static handleGetDate(url_parsed, res) {
        const query = url_parsed.query;
        const date = StringUtility.getDate();
        const dataToWrite = StringUtility.formatMessage(USER_MESSAGES.SUCCESS.SUCCESS_DATE_DATA, query.name, date)
        res.writeHead(200, {"Content-Type" : html_content});
        res.write(dataToWrite)
        res.end();
    }
}



const server = new Server(8000)
server.start()