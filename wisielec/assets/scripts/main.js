"use strict";
var request = new XMLHttpRequest();
const url = "./assets/data/slowa.json";
var slowa;
var gra;
request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        slowa = JSON.parse(this.responseText);
        gra = new Wisielec(slowa[Math.floor(Math.random() * slowa.length)]);
        gra.init();
    }
};

window.onload = () => {
    document.querySelector("#refresh").onclick = () => {
        gra = new Wisielec(slowa[Math.floor(Math.random() * slowa.length)]);
        gra.init();
        document.querySelector("#letter-input").focus();
    };
    const letterInput = document.querySelector("#letter-input");
    letterInput.addEventListener("keyup", e => {
        e.preventDefault();
        gra.addLetter(e.key);
        letterInput.value = "";
    });
    request.open("GET", url, true);
    request.send();
    letterInput.focus();
};

function addLetter(event) {
    const letter = event.target.innerText;
}

class Wisielec {
    constructor(word) {
        this.word = word.toUpperCase();
        this.invalidLetters = [];
        this.correctLetters = [];
    }
    init() {
        this.fillResult();
        document.querySelector("#endMessage").innerText = "";
        this.ctx = document.querySelector("#szubienica").getContext("2d");
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.strokeStyle = "rgba(255, 255, 255, 95%)";
        this.ctx.fillStyle = "rgba(255, 255, 255, 95%)";
        this.ctx.font = "100px 'Roboto', sans-serif";
        this.finished = false;
    }
    get letters() {}
    addLetter(letter) {
        letter = letter.toUpperCase();
        if (
            !letter.match(/^[A-Ź]+$/gi) ||
            letter.length != 1 ||
            this.invalidLetters.includes(letter) ||
            this.correctLetters.includes(letter) ||
            this.finished
        )
            return;
        if (this.word.includes(letter)) {
            this.correctLetters.push(letter);
            if (
                this.correctLetters.sort().join("") ==
                [...new Set(this.word.split("").sort())].join("")
            ) {
                this.finish();
                return;
            }
            this.fillResult();
        } else {
            this.invalidLetters.push(letter);
            this.fillHangman();
            this.fillInvalidLetters();
        }
    }
    fillResult() {
        const correctLetterRegex = new RegExp(
            `[^${this.correctLetters.join("")}]`,
            "gi"
        );
        const filteredWord = this.word.replace(correctLetterRegex, "_");
        document.querySelector("#wordresult").value = filteredWord;
    }
    drawLine(x1, y1, x2, y2, lineWidth, color, ratio = 0) {
        if (ratio <= 1) {
            requestAnimationFrame(() => {
                if (!!color) this.ctx.strokeStyle = color;
                this.ctx.beginPath();
                this.ctx.lineWidth = lineWidth;
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x1 + (x2 - x1) * ratio, y1 + (y2 - y1) * ratio);
                this.ctx.stroke();
                this.drawLine(x1, y1, x2, y2, lineWidth, color, ratio + 0.05);
            });
        }
    }
    fillInvalidLetters() {
        const width = this.ctx.canvas.width;
        const height = this.ctx.canvas.height;
        const letter = this.invalidLetters[this.invalidLetters.length - 1];
        const measurment = this.ctx.measureText(letter);
        const letterWidth = measurment.width;
        const letterHeight =
            measurment.actualBoundingBoxAscent +
            measurment.actualBoundingBoxDescent +
            1;
        this.ctx.beginPath();
        this.ctx.fillText(
            letter,
            width * 0.9 + (width * 0.05 - letterWidth) / 2,
            (height * (this.invalidLetters.length + 1)) / 10
        );
        this.drawLine(
            width * 0.895 + (width * 0.05 - letterWidth) / 2,
            (height * (this.invalidLetters.length + 1)) / 10,
            width * 0.91 + (width * 0.05 - letterWidth) / 2 + letterWidth,
            (height * (this.invalidLetters.length + 1)) / 10 - letterHeight,
            5,
            "#B71C1C"
        );
    }
    fillHangman() {
        const width = this.ctx.canvas.width;
        const height = this.ctx.canvas.height;
        switch (this.invalidLetters.length) {
            case 1:
                this.drawLine(
                    0,
                    height,
                    width * 1,
                    height,
                    70,
                    "rgba(255, 255, 255, 95%)"
                );
                break;
            case 2:
                this.drawLine(
                    width * 0.1,
                    height,
                    width * 0.1,
                    height * 0.05,
                    60,
                    "rgba(255, 255, 255, 95%)"
                );
                break;
            case 3:
                this.drawLine(
                    0,
                    height * 0.1,
                    width * 0.8,
                    height * 0.1,
                    40,
                    "rgba(255, 255, 255, 95%)"
                );
                this.drawLine(
                    width * 0.1,
                    height * 0.3,
                    width * 0.3,
                    height * 0.1,
                    40,
                    "rgba(255, 255, 255, 95%)"
                );
                break;
            case 4:
                this.drawLine(
                    width * 0.6,
                    height * 0.1,
                    width * 0.6,
                    height * 0.3,
                    20,
                    "rgba(255, 255, 255, 95%)"
                );
                break;
            case 5:
                this.ctx.beginPath();
                this.ctx.lineWidth = 20;
                this.ctx.strokeStyle = "rgba(255, 255, 255, 95%)";
                this.ctx.arc(
                    width * 0.6,
                    height * 0.34,
                    height * 0.05,
                    0,
                    2 * Math.PI
                );
                this.ctx.stroke();
                break;
            case 6:
                this.drawLine(
                    width * 0.6,
                    height * 0.39,
                    width * 0.6,
                    height * 0.7,
                    25,
                    "rgba(255, 255, 255, 95%)"
                );
                break;
            case 7:
                this.drawLine(
                    width * 0.6,
                    height * 0.5,
                    width * 0.5,
                    height * 0.33,
                    20,
                    "rgba(255, 255, 255, 95%)"
                );
                this.drawLine(
                    width * 0.6,
                    height * 0.5,
                    width * 0.7,
                    height * 0.33,
                    20,
                    "rgba(255, 255, 255, 95%)"
                );
                break;
            case 8:
                this.drawLine(
                    width * 0.6,
                    height * 0.68,
                    width * 0.48,
                    height * 0.9,
                    27,
                    "rgba(255, 255, 255, 95%)"
                );
                this.drawLine(
                    width * 0.6,
                    height * 0.68,
                    width * 0.72,
                    height * 0.9,
                    27,
                    "rgba(255, 255, 255, 95%)"
                );
            default:
                this.finish();
                break;
        }
    }
    finish() {
        this.finished = true;
        let endMessage;
        let endMessageColor;
        if (this.invalidLetters.length >= 8) {
            endMessage = "Porażka";
            endMessageColor = "#B71C1C";
        } else if (
            this.correctLetters.sort().join("") ==
            [...new Set(this.word.split("").sort())].join("")
        ) {
            endMessage = "Gratulacje!";
            endMessageColor = "#1B5E20";
        }
        this.correctLetters = ["[]"];
        this.fillResult();
        const endMessageElement = document.querySelector("#endMessage");
        endMessageElement.innerText = endMessage;
        endMessageElement.style.color = endMessageColor;
    }
}
