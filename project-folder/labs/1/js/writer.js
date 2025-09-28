import {PageHandler, NoteHandler, UI } from "./script.js";


document.addEventListener('DOMContentLoaded', function() {
    UI.loadUI()
    const noteContainer = UI.loadNotes()
    UI.updateStorage(noteContainer, true)
    NoteHandler.addNote(noteContainer)
    NoteHandler.removeNote(noteContainer)
    NoteHandler.handleNoteContentChange(noteContainer)
    PageHandler.goBack()
});