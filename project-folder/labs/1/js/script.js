import USER_MESSAGES from '../lang/messages/en/user.js'



console.log(localStorage.getItem("notes"))


class PageHandler {
    static goToWriterPage() {
        document.getElementById("writer-button").addEventListener("click", function() {
            window.location.href = "writer.html"
        })
    }
    static goToReaderPage() {
        document.getElementById("reader-button").addEventListener("click", function() {
            window.location.href = "reader.html"
        })
    }
    static goBack() {
        document.getElementById("back-button").addEventListener("click", function() {
            window.location.href = "index.html"
        })
    }
}

class NoteContainer {
    constructor(noteList) {
        this.container = noteList
    }
    addNote(note) {
        this.container.push(note)
    }
    removeNote(note) {
        this.container = this.container.filter(theNote => theNote !== note)
    }

    getContainer() {
        return this.container
    }
    getLength() {
        return this.container.length
    }
}


class Note {
    constructor(noteNumber, content="") {
        this.number = noteNumber
        this.content = content
        this.note = document.createElement("textarea")
        this.note.classList.add("note-container")
        this.note.id = this.number
        this.note.value = this.content
    }
    write(content) {
        this.content = content 
        this.note.value = content
    }
}

class NoteHandler {

    static extractNoteInfo(noteContainer) {
        const noteObjList = []
        noteContainer.getContainer().forEach(note => {
            noteObjList.push(
                {
                number : NoteHandler.getNoteNumber(note),
                content : NoteHandler.getContent(note)
            }
            )
        })
        return noteObjList

    }

    static parseObjectToNote(noteObjList) {
        const noteList = new NoteContainer([])
        console.log(noteObjList)
        noteObjList.forEach(noteObj => {
            const note = new Note(noteObj.number, noteObj.content)
            noteList.addNote(note)
        })
        return noteList

    }

    static getContent(note) {
        return note.content
    }

    static getNoteNumber(note) {
        return note.number
    }

    static getNoteDiv(note) {
        return note.note
    }

    static handleNoteContentChange(noteContainer) {
        noteContainer.getContainer().forEach(note => {
            const noteElement = NoteHandler.getNoteDiv(note)
            noteElement.addEventListener("input", function() {
                note.write(this.value)
            })
        })
    }

    static addNote(noteContainer) {
        
        const addButton = document.getElementById("add-button")
        addButton.addEventListener("click", function() {
            console.log("here")
            const noteNumber = noteContainer.getLength() + 1 
            const note = new Note(noteNumber)
            noteContainer.addNote(note)
            UI.addNoteContent(noteContainer, note, true)
        })
    }

    static removeNote(noteContainer, note) {
        noteContainer.removeNote(note)
    }

    static disableWriting(note) {
            NoteHandler.getNoteDiv(note).disabled = true;
    }
}



class UI {

    static loadIndex() {
        const writerPageButton = document.getElementById("writer-button")
        const readerPageButton = document.getElementById("reader-button")
        const landingPageTitle = document.getElementById("title")
        writerPageButton.textContent = USER_MESSAGES.BUTTONS.WRITER
        readerPageButton.textContent = USER_MESSAGES.BUTTONS.READER
        landingPageTitle.textContent = USER_MESSAGES.TITLE.LANDING_PAGE

    }

    static loadUI(writer=true){
        if (writer) {
            document.getElementById("add-button").textContent = USER_MESSAGES.BUTTONS.ADD
        }
        UI.updateTime()
        document.getElementById("back-button").textContent = USER_MESSAGES.BUTTONS.BACK
    }

    // I asked claude how to get real time
    static updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
        document.getElementById("time-display").textContent = `${USER_MESSAGES.TIME.STORE}${timeString}`

    }

    static createRemoveButton(noteIdentifier) {
        const removeButton = document.createElement("button")
        removeButton.classList.add("remove-button")
        removeButton.id = noteIdentifier
        return removeButton
    }

    static getNoteArea() {
        return document.getElementById("note-area")
    }

    // I asked claude how to always call a function every certain amount of seconds, and i got setInterval
    static updateStorage(noteContainer) {
        setInterval(()=> 
        UI.updateLocalStorage(noteContainer), 2000)
    }

    static updateLocalStorage(noteContainer) {
        const noteObjList = NoteHandler.extractNoteInfo(noteContainer)
        localStorage.setItem("notes", JSON.stringify(noteObjList))
        
        UI.updateTime()
        console.log(`The storage: ${localStorage.getItem("notes")}`)
    }
    static addNoteContent(noteContainer, note, mode) {
        const noteArea = UI.getNoteArea()
        const noteNumber = NoteHandler.getNoteNumber(note)
        const notePart = document.createElement("div")
        notePart.classList.add("note-part")
        if (mode) {
            const removeButton = UI.createRemoveButton(noteNumber)
            removeButton.textContent = USER_MESSAGES.BUTTONS.REMOVE
            notePart.appendChild(NoteHandler.getNoteDiv(note))
            notePart.appendChild(removeButton)    
            noteArea.appendChild(notePart)
            removeButton.onclick = function() {
                NoteHandler.removeNote(noteContainer, note)
                noteArea.removeChild(notePart)
                UI.updateLocalStorage(noteContainer)
                
            }
        } else {
            notePart.appendChild(NoteHandler.getNoteDiv(note))
            noteArea.appendChild(notePart)
            NoteHandler.disableWriting(note)

        }
            
    }

    static loadNotes(writer=true) {
        const parsedStorageData = JSON.parse(localStorage.getItem("notes")) || []
        const noteContainer = NoteHandler.parseObjectToNote(parsedStorageData)
        noteContainer.getContainer().forEach(note => {
            UI.addNoteContent(noteContainer, note, writer)
        });
        return noteContainer
    }

}




export {NoteHandler, UI, PageHandler};