import { PageHandler,  UI } from "./script.js";


// I asked claude if there is an event handler for when localStorage changes
window.addEventListener('storage', (event) => {
    if (event.key === 'notes') {
        document.getElementById('note-area').innerHTML = '';
        UI.loadNotes(false);
    }
});


document.addEventListener('DOMContentLoaded', function() {
    UI.loadUI(false)
    const noteContainer = UI.loadNotes(false)
    UI.updateStorage(noteContainer)
    PageHandler.goBack()
});