import USER_MESSAGES from '../lang/messages/en/user.js'

const theForm = document.getElementById("the-form")

const buttonsArea = document.getElementById("buttons-area")

const gameMessage = document.getElementById("game-message")


class ButtonContainer {
    constructor() {
        this.container = []
    }

    addButton(theButton) {
        this.container.push(theButton)
    } 

    createManyButtons(totalButtons) {
        for (let i = 1; i <= totalButtons; i++) {
            const theButton = new Button(i)
            theButton.setBackgroundColour()
            this.addButton(theButton)
        }
    }

    getLength() {
        return this.container.length
    }
}

class NumberUtility {

    static generateRandomNumber(maxValue) {
        return Math.floor(Math.random() * (maxValue + 1))
    }
    
    // I asked claude how to pause a program for certain amount of seconds
    static sleep(seconds) {
        const milliseconds = 1000 * seconds
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
}

class Button {
    constructor(orderNumber) {
        this.notClicked = true;
        this.orderNumber = orderNumber;
        this.btn = document.createElement("button");
        this.btn.textContent = this.orderNumber;
        this.btn.classList.add("the-button");
        this.btn.style.position = "absolute"
        buttonsArea.appendChild(this.btn);
    }

    setBackgroundColour() {
        const maxHex = 255
        const r = NumberUtility.generateRandomNumber(maxHex);
        const g = NumberUtility.generateRandomNumber(maxHex);
        const b = NumberUtility.generateRandomNumber(maxHex);
        this.btn.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    setTop(value) {
        this.btn.style.top = value
    }

    setLeft(value) {
        this.btn.style.left = value
    }
}

class GameAreaHandler {


    static addUserStringToElements() {
        const gameButton = document.getElementById("game-button")
        const userGuide = document.getElementById("user-guide")
        gameButton.textContent = USER_MESSAGES.BUTTONS.GO
        userGuide.textContent = USER_MESSAGES.PROMPTS.BUTTON_COUNT
    }

    static validateUserInput(userInput){
        const minimum = 3
        const maximum = 7
        if (userInput >= minimum && userInput <= maximum) {
            return true
        } else {
            gameMessage.innerHTML = USER_MESSAGES.FEEDBACK.WRONG_INPUT
            gameMessage.style.color = "red"
            return false
        }

    }


    static handleWindowResizing(buttonContainer, game) {
        const resizeHandler = () => {
            GameAreaHandler.adjustButtonSizes(buttonContainer);
            if (!game.started) {
                GameAreaHandler.setButtonsWithWrapping(buttonContainer);
            }
        };
        
        window.addEventListener('resize', resizeHandler);
    }

    static handleLossMessage() {
        gameMessage.innerHTML = MessageHandler.get_wrong_order_message()
        gameMessage.style.color = "red"

    }
    static handleWinMessage() {
        gameMessage.innerHTML = MessageHandler.get_success_message()
        gameMessage.style.color = "green"

    }


    static resizeHandler(game, buttonContainer) {
        GameAreaHandler.adjustButtonSizes(buttonContainer);
        if (!(game.started)) {
            GameAreaHandler.setButtonsWithWrapping(buttonContainer)
        }

    }
    // I asked claude how to resize the button when the window is resized
    static adjustButtonSizes(buttonContainer) {
        const containerWidth = buttonsArea.offsetWidth;
        const buttonCount = buttonContainer.getLength();
        const availableWidth = containerWidth - 15
        const buttonWidth = Math.max(60, Math.min(160, availableWidth / buttonCount));
        const buttonHeight = buttonWidth * 0.5;
        
        buttonContainer.container.forEach(button => {
            button.btn.style.width = `${buttonWidth}px`;
            button.btn.style.height = `${buttonHeight}px`;
            button.btn.style.fontSize = `${Math.max(0.7, buttonWidth / 120)}rem`;
        });
    }

       //I asked claude how to resize the button for when aligning them before the shuffle when the window is resized
    static setButtonsWithWrapping(buttonsContainer) {
        this.adjustButtonSizes(buttonsContainer);
        
        const containerWidth = buttonsArea.offsetWidth;
        const buttonWidth = buttonsContainer.container[0].btn.style.width
        const buttonWidthPx = parseInt(buttonWidth);
        const spacingPx = 15;
        
        const buttonWidthPercent = (buttonWidthPx / containerWidth) * 100;
        const spacingPercent = (spacingPx / containerWidth) * 100;
        
        let currentX = spacingPercent;
        let currentY = 5;
        let currentRow = 0;
        
        buttonsContainer.container.forEach((button) => {
            if (currentX + buttonWidthPercent > 100 - spacingPercent) {
                currentRow++;
                currentX = spacingPercent;
                currentY = 5 + (currentRow * 10);
            }
            
            button.btn.style.left = `${currentX}%`;
            button.btn.style.top = `${currentY}%`;
            
            currentX += buttonWidthPercent + spacingPercent;
        });
    }

    static clearGameArea() {
        buttonsArea.innerHTML = ""
        gameMessage.innerHTML = ""
    }

    static setUpGameArea(buttonContainer, numberOfButtons) {
        buttonContainer.createManyButtons(numberOfButtons)
    }

    static disableButton() {
        const gameButton = document.getElementById("game-button")
        gameButton.disabled = true
    }

    static enableButton() {
        const gameButton = document.getElementById("game-button")
        gameButton.disabled = false
    }


}

class Game {

    constructor(numberOfButtons) {
        this.numberOfButtons = numberOfButtons
        this.buttonContainer = new ButtonContainer()
        this.started = false;
    }

    async playGame() {
        GameAreaHandler.setUpGameArea(this.buttonContainer, this.numberOfButtons)
        GameAreaHandler.handleWindowResizing(this.buttonContainer, this)
        const containerSize = this.buttonContainer.getLength()
        GameAreaHandler.setButtonsWithWrapping(this.buttonContainer)
        GameAreaHandler.adjustButtonSizes(this.buttonContainer)
        await NumberUtility.sleep(containerSize)
        this.started = true
        await this.shuffleButtons(containerSize)
        GameAreaHandler.enableButton()
        this.guessingGamePart(containerSize)
    }

    async shuffleButtons(containerSize) {
        GameAreaHandler.disableButton()
        const interval = 2
        let toPlay = containerSize
        while (toPlay > 0) {
            this.buttonContainer.container.forEach(button => {
                ButtonController.setRandomPosition(button)
            });
            await NumberUtility.sleep(interval)
            toPlay -= 1
        }
    }

    guessingGamePart(containerSize) {
        const container = this.buttonContainer
        let orderTracker = 0
        this.buttonContainer.container.forEach(button => {
            ButtonController.hideNumber(button)
            button.btn.addEventListener("click", function() {
                if (ButtonController.getButtonClickStatus(button)) {
                    ButtonController.clickButton(button)
                    const totalCount = orderTracker + 1
                    const buttonNumber = ButtonController.getOrderNumber(button)
                    const difference = buttonNumber - orderTracker
                    if (difference != 1) {
                        ButtonController.showButtons(container)
                        GameAreaHandler.handleLossMessage()
                    }
                    else {
                        ButtonController.showNumber(button)
                        orderTracker += 1
                    }
                    if (containerSize === totalCount) {
                        GameAreaHandler.handleWinMessage()
                    }
                }
            })
        })

    }

}

class MessageHandler {

    static get_button_count_message() {
        return USER_MESSAGES.PROMPTS.BUTTON_COUNT
    } 

    static get_button_go() {
        return USER_MESSAGES.BUTTONS.GO
    }

    static get_success_message() {
        return USER_MESSAGES.FEEDBACK.SUCCESS
    }

    static get_wrong_order_message() {
        return USER_MESSAGES.FEEDBACK.WRONG_ORDER
    }
}

class ButtonController {

    static hideNumber(button) {
        button.btn.textContent = ""
        button.btn.classList.add("active")
    }

    static showNumber(button) {
        button.btn.textContent = button.orderNumber
        button.btn.classList.remove("active")
    }
    static getOrderNumber(button) {
        return button.orderNumber
    }
    static showButtons(buttonContainer) {
        buttonContainer.container.forEach(button => {
            ButtonController.showNumber(button)
        })
    }
    static getButtonClickStatus(button) {
        return button.notClicked
    }

    static clickButton(button) {
        button.notClicked = !(button.notClicked)
    }

    static setRandomPosition(button) {
        const maxSize = 75
        let position = {
            top: NumberUtility.generateRandomNumber(maxSize),
            left: NumberUtility.generateRandomNumber(maxSize)
        }
        button.btn.style.top = `${position.top}%`
        button.btn.style.left = `${position.left}`
    }   
}


theForm.addEventListener("submit", async function(event) {
    event.preventDefault()
    GameAreaHandler.clearGameArea()
    const inputValue = document.getElementById("number-input").value
    const totalButtons = parseInt(inputValue);
    if (GameAreaHandler.validateUserInput((totalButtons))){
        const theGame = new Game(totalButtons)
        await theGame.playGame()
    }
})


document.addEventListener('DOMContentLoaded', function() {
    GameAreaHandler.addUserStringToElements()
});