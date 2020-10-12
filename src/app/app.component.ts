import { Component } from '@angular/core';

type Letter = {
  character:string,
  show:boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'theHanged';

  private gameStructure:any = {
    rules: {
      time: 180,
      life: 6,
      clue: 1
    },
    words: [
      "palanca",
      "la bomba",
      "la momia: el regreso"
    ]
  }
  characters:string[] = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","R","S","T","U","V","W","X","Y","Z",
  "1","2","3","4","5","6","7","8","9","0",
  ":","'","-"];
  randomWord:number = Math.floor(Math.random() * this.gameStructure.words.length);
  wordLetters:string[] = this.gameStructure.words[this.randomWord].split("");
  wordLength:any[] = new Array(this.wordLetters.length);
  showWord:boolean = false;
  time:number = this.gameStructure.rules.time;
  letters:Letter[] = [];
  theLetter:Letter = {
    character: "",
    show: false
  }
  life:number = this.gameStructure.rules.life;
  clue:number = this.gameStructure.rules.clue;

  start() {
    setInterval(() => {
      if(this.time > 0) this.time += -1;
    }, 1000);

    setTimeout(() => {
      this.generateRandomWord();
    }, 0);
  }

  generateRandomWord() {
    this.wordLetters.forEach(wordLetter=>{
      this.theLetter = {
        character: wordLetter.toUpperCase(),
        show: false
      }
      this.letters.push(this.theLetter);
    });
    this.showWord = true;
    setTimeout(() => {
      this.drawDivs();
    }, 0);
  }

  drawDivs() {
    let worDivs = document.getElementsByClassName("letter");
    this.letters.forEach((letter, index) => {
      if(letter.character != " ") worDivs[index].setAttribute("class","letter red");
    })
  }

  compareLetter(letterToCompare) {
    document.getElementById(letterToCompare.textContent).setAttribute("disabled","true");
    let letterLower = letterToCompare.textContent.toLowerCase();
    let word:string = this.wordLetters.join("");
    let index:number = word.indexOf(letterLower);
    let indexes:number[] = [];
    while(index != -1) {
      indexes.push(index);
      index = word.indexOf(letterLower, index + 1);
    }
    if (indexes.length != 0) this.guessLetter(indexes);
    else this.reduceLife();
  }

  guessLetter(indexes:number[]) {
    indexes.forEach(index => this.letters[index].show = true);
  }

  reduceLife() {
    if (this.life === 0) this.endGame();
    else return this.life += - 1;
  }

  endGame() {
    this.time = 0;
  }
}
