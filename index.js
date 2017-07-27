(function() {
  // DOM
  const boxes = [...document.getElementsByClassName("box")];
  const start = document.getElementById("start");
  const strict = document.getElementById("strict");
  const level = document.getElementById("level");
  const red = document.getElementById("red");
  const blue = document.getElementById("blue");
  const green = document.getElementById("green");
  const yellow = document.getElementById("yellow");
  const reset = document.getElementById("reset");
  const DOM = { boxes, start, level, red, blue, green, yellow, strict, reset };

  // SOUNDS
  const audio1 = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
  );
  const audio2 = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
  );
  const audio3 = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
  );
  const audio4 = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
  );

  const audio5 = new Audio("sad_trombone.mp3");

  const sounds = {
    red: audio1,
    blue: audio2,
    green: audio3,
    yellow: audio4,
    lose: audio5
  };

  // HELPERS
  const colors = { 1: "red", 2: "blue", 3: "green", 4: "yellow" };

  function generateSequence() {
    return Array.from({ length: 20 }, () => {
      return colors[Math.floor(Math.random() * 4) + 1];
    });
  }

  // GAME LOGIC

  function Game(sequence, DOM, sounds) {
    this.state = {
      sequence: sequence,
      level: 0,
      currentUserSequence: [],
      strict: false,
      on: false
    };
    this.DOM = DOM;
    this.sounds = sounds;
    this.timeout;
    this.generateSequence = sequence;
  }

  Game.prototype.start = function() {
    let self = this;
    this.DOM.boxes.forEach(box => {
      box.addEventListener("click", e => {
        setTimeout(() => {
          self.DOM[e.target.id].style.backgroundColor = "black";
          self.state.currentUserSequence.push(e.target.id);
          self.sounds[e.target.id].play();
          self.checkSequence();
          setTimeout(() => {
            self.DOM[e.target.id].style.backgroundColor = `${e.target.id}`;
          }, 300);
        });

        return;
      });
    });

    this.DOM.reset.addEventListener("click", () => {
      console.log("reset clicked");
      this.reset();
      clearTimeout(this.timeout);
      return;
    });

    this.DOM.strict.addEventListener("change", e => {
      if (e.target.checked) {
        this.state.strict = true;
        return;
      } else {
        this.state.strict = false;
        return;
      }
      return;
    });

    this.DOM.start.addEventListener("click", () => {
      this.nextRound();
      return;
    });
  };

  Game.prototype.runThruSequence = function() {
    for (let i = 0; i < this.state.level; i++) {
      const color = this.state.sequence[i];
      let self = this;
      (function(self, color, i) {
        self.timeout = setTimeout(() => {
          self.DOM[color].style.backgroundColor = "black";
          self.sounds[color].play();
          setTimeout(() => {
            self.DOM[color].style.backgroundColor = `${color}`;
            return;
          }, 400);
        }, i * 1000);
      })(self, color, i + 1);
    }
  };

  Game.prototype.checkSequence = function() {
    for (let i = 0; i < this.state.currentUserSequence.length; i++) {
      const userInput = this.state.currentUserSequence[i];
      const gameInput = this.state.sequence[i];
      if (userInput !== gameInput && !this.state.strict) {
        this.resetCurrentRound();
        alert("Press Okay to try again");
        return;
      }
      if (userInput !== gameInput && this.state.strict) {
        this.reset();
        this.sounds.lose.play();
        return;
      }
    }

    if (this.state.currentUserSequence.length === 20) {
      alert("You won! Yay!");
    }

    if (this.state.currentUserSequence.length === this.state.level) {
      this.nextRound();
      return;
    }

    return;
  };

  Game.prototype.resetCurrentRound = function() {
    this.state.currentUserSequence = [];
    this.DOM.level.textContent = `Level ${this.state.level}`;
    this.runThruSequence();
    return;
  };

  Game.prototype.nextRound = function() {
    this.state.level++;
    this.state.currentUserSequence = [];
    this.DOM.level.textContent = `Level ${this.state.level}`;
    this.runThruSequence();
    return;
  };

  Game.prototype.reset = function() {
    this.state = Object.assign(
      {},
      {
        sequence: generateSequence(),
        level: 0,
        currentUserSequence: []
      }
    );
    this.nextRound();
    return;
  };

  const main = new Game(generateSequence(), DOM, sounds);
  main.start();
})();

// TODO: Fix restart button
