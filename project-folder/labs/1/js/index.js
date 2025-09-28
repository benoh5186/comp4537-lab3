import { UI, PageHandler } from "./script.js"

document.addEventListener("DOMContentLoaded", function() {
    UI.loadIndex()
    PageHandler.goToWriterPage()
    PageHandler.goToReaderPage()

})