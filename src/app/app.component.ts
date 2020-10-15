import { Component } from '@angular/core';

type Letter = {
  character:string,
  show:boolean
}

type Score = {
  won: number,
  lost: {
    timeout: number,
    life: number
  }
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
  clueDisabled:boolean = false;
  clueUsed:string = "No";
  gameFinished:boolean = true;
  gameStarted:boolean = false;
  //startInterval = setInterval(this.start, 1000);
  //hangedImages: string[] = ["0", "1", "2", "3", "4", "5", "6"];
  hanged:string = "../assets/images/"+this.life+".png";
  showScore:boolean = false;
  score:Score = JSON.parse(localStorage.getItem("score"));

  start() {
    this.gameStarted = !this.gameStarted;
    this.gameFinished = !this.gameFinished;
    this.life = 6;
    this.time = 180;

    if (this.gameFinished === false) {
      let interval = setInterval(() => {
        if (this.time > 0) this.time += -1;
        if (this.time === 0 || this.gameFinished === true) {
          clearInterval(interval);
          this.showWord = false;
          console.log("time fuera!!")
          if(this.score != null) this.score.lost.timeout += 1;
          else {
            this.score = {
              won: 0,
              lost: {
                timeout: 0,
                life: 0
              }
            };
            this.score.lost.timeout += 1;
          }

          setTimeout(() => {
            this.saveScore();
          }, 500);

          setTimeout(() => {
            this.showScore = true;
          }, 500);
        }
      }, 1000);

      document.getElementById("restart").addEventListener("click", function(){
        clearInterval(interval);
      });

      setTimeout(() => {
        this.generateRandomWord();
      }, 0);
    }
  }

  generateRandomWord() {
    if (this.letters.length > 0) this.letters = [];
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
      else letter.show = true;
    });
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
    if(this.score != null) this.score.won += 1;
    else {
      this.score = {
        won: 0,
        lost: {
          timeout: 0,
          life: 0
        }
      };
      this.score.won += 1;
    }
    setTimeout(() => {
      this.saveScore();
    }, 500);
  }

  reduceClue() {
    this.clue += -1;
    this.clueDisabled = true;
    this.clueUsed = "Yes";
    setTimeout(()=>{
      this.reduceLife();
    });
  }

  reduceLife() {
    if (this.life > 1) {
      this.life += -1;
      this.hanged = "../assets/images/"+this.life+".png";
    }
    else {
      this.life += -1;
      console.log("life fuera!!")

      if(this.score != null) this.score.lost.life += 1;
      else {
        this.score = {
          won: 0,
          lost: {
            timeout: 0,
            life: 0
          }
        };
        this.score.lost.life += 1;
      }

      setTimeout(() => {
        this.saveScore();
      }, 500);

    }
  }

  saveScore() {

    setTimeout(() => {
      this.isWordComplete();
    }, 0);
  }

  isWordComplete() {
    if(this.letters.every(letter => letter.show)) {
      this.showScore = true;
      setTimeout(() => {
        this.start();
      }, 0);
    }
  }

  restart() {
    this.gameStarted = !this.gameStarted;
    this.gameFinished = !this.gameFinished;
    this.showScore = false;
    this.randomWord= Math.floor(Math.random() * this.gameStructure.words.length);
    this.wordLetters= this.gameStructure.words[this.randomWord].split("");
    this.clue = 1;
    this.clueDisabled = false;
    this.life = 6;
    this.hanged = "../assets/images/"+this.life+".png";
    this.time = 180;
    let characters = document.getElementsByClassName("character");
    for (let index = 0; index < characters.length; index++) {
      characters[index].removeAttribute("disabled");
    }
    setTimeout(() => {
      this.start();
    }, 0);
  }

}
