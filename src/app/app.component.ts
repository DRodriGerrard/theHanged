import { Component } from '@angular/core';

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
      "la bomba"
    ]
  }
  randomWord:number = 0;
  wordLetters:string[] = [];
  time:number = this.gameStructure.rules.time;


  start() {
    setInterval(() => {
      if(this.time > 0) this.time += -1;
    }, 1000);

    setTimeout(() => {
      this.generateRandomWord();
    }, 0);
  }

  generateRandomWord() {
    this.randomWord = Math.floor(Math.random() * this.gameStructure.words.length);
    this.wordLetters = this.gameStructure.words[this.randomWord].split("");
  }
}
