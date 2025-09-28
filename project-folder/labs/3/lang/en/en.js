const USER_MESSAGES = {
    HEADER : {
        CONTENT_TYPE : "Content-Type",
        HTML_CONTENT : "text/html"
    },
    ERROR : {
        ENDPOINT_NOT_FOUND : "endpoint not found",
        FILE_NOT_FOUND : `%1 Failed to locate a file with name: %2`,
        FILE_NOT_WRITTEN : "404 failed to write to the file"

    },
    SUCCESS : {
        RES_DISPLAY_FILE_DATA : "<p>%1</p>",
        SUCCESS_WRITTEN : "Successfully written %1 to the file!",
        SUCCESS_DATE_DATA : "<p style='color:blue'>Hello, %1 What a beautiful day. Server current date and time is %2 </p>"

    },
    FILE : "file.txt"
    
};

const API_ENDPOINTS = {
    GET_DATE : "/getDate",
    READ_FILE : "/readFile",
    WRITE_FILE : "/writeFile"
}


module.exports = {USER_MESSAGES, API_ENDPOINTS}