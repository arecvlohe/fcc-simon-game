(function(chroma) {
  // DOM
  const boxes = [...document.getElementsByClassName("box")];
  const body = document.body;
  const start = document.getElementById("start");
  const strict = document.getElementById("strict");
  const count = document.getElementById("count");
  const red = document.getElementById("red");
  const blue = document.getElementById("blue");
  const green = document.getElementById("green");
  const yellow = document.getElementById("yellow");
  const reset = document.getElementById("reset");
  const DOM = {
    boxes,
    start,
    count,
    red,
    blue,
    green,
    yellow,
    strict,
    reset,
    body
  };

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

  function Game(sequence, DOM, sounds, generateSequence) {
    this.state = {
      sequence: sequence,
      count: 0,
      currentUserSequence: [],
      strict: false,
      on: false
    };
    this.DOM = DOM;
    this.sounds = sounds;
    this.generateSequence = generateSequence;
    this.timeout;
    this.interval;
  }

  Game.prototype.start = function() {
    let self = this;
    this.DOM.boxes.forEach(box => {
      box.addEventListener("click", e => {
        const color = e.target.id;
        self.DOM[color].style.backgroundColor = chroma(color).desaturate();
        self.state.currentUserSequence.push(color);
        self.sounds[color].play();
        self.checkSequence();
        setTimeout(() => {
          self.DOM[color].style.backgroundColor = `${color}`;
        }, 300);
        return;
      });
    });

    this.DOM.reset.addEventListener("click", () => {
      this.reset();
      return;
    });

    this.DOM.strict.addEventListener("change", e => {
      if (e.target.checked) {
        let conf = confirm(
          "Setting strict will reset the game. Are you sure you want to do this"
        );
        if (conf) {
          this.state.strict = true;
          this.reset();
        }
        return;
      } else {
        let conf = confirm(
          "Setting to not strict will reset the game. Are you sure you want to do this?"
        );
        this.state.strict = false;
        this.reset();
        return;
      }
      return;
    });

    this.DOM.start.addEventListener("click", () => {
      if (this.state.count > 0) return;
      this.nextRound();
      return;
    });
  };

  Game.prototype.runThruSequence = function() {
    for (let i = 0; i < this.state.count; i++) {
      const color = this.state.sequence[i];
      let self = this;
      (function(self, color, i) {
        self.timeout = setTimeout(() => {
          self.DOM[color].style.backgroundColor = chroma(color).desaturate(2);
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
        alert("Press OK to try again");
        return;
      }
      if (userInput !== gameInput && this.state.strict) {
        this.sounds.lose.play();
        setTimeout(() => {
          this.reset();
          return;
        }, 3000);
        return;
      }
    }

    if (this.state.currentUserSequence.length === 20) {
      alert("You won! Yay!");
      this.reset();
      return;
    }

    if (this.state.currentUserSequence.length === this.state.count) {
      this.nextRound();
      return;
    }

    return;
  };

  Game.prototype.resetCurrentRound = function() {
    this.state.currentUserSequence = [];
    this.DOM.count.textContent = `COUNT ${this.state.count}`;
    this.runThruSequence();
    return;
  };

  Game.prototype.nextRound = function() {
    this.state.count++;
    this.state.currentUserSequence = [];
    this.DOM.count.textContent = `COUNT ${this.state.count}`;
    this.runThruSequence();
    return;
  };

  Game.prototype.reset = function() {
    this.state = Object.assign({}, this.state, {
      sequence: this.generateSequence(),
      count: 0,
      currentUserSequence: []
    });

    this.nextRound();

    return;
  };

  const main = new Game(generateSequence(), DOM, sounds, generateSequence);
  main.start();
})(window.chroma);
