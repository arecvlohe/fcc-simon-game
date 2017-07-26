(function() {
  // DOM
  const boxes = [...document.getElementsByClassName("box")];
  const start = document.getElementById("start");
  const level = document.getElementById("level");
  const red = document.getElementById("red");
  const blue = document.getElementById("blue");
  const green = document.getElementById("green");
  const yellow = document.getElementById("yellow");
  const DOM = { boxes, start, level, red, blue, green, yellow };

  // HELPERS
  const colors = { 1: "red", 2: "blue", 3: "green", 4: "yellow" };

  function generateSequence() {
    return Array.from({ length: 20 }, () => {
      return colors[Math.floor(Math.random() * 4) + 1];
    });
  }

  // GAME LOGIC

  function Game(sequence, DOM) {
    this.state = {
      sequence: sequence,
      level: 0,
      currentUserSequence: []
    };
    this.DOM = DOM;
  }

  Game.prototype.start = function() {
    let self = this;
    this.DOM.boxes.forEach(box => {
      box.addEventListener("click", e => {
        self.state.currentUserSequence.push(e.target.id);
        self.checkSequence();
        return;
      });
    });

    this.DOM.start.addEventListener("click", () => {
      this.nextRound();
    });
  };

  Game.prototype.runThruSequence = function() {
    for (let i = 0; i < this.state.level; i++) {
      const color = this.state.sequence[i];
      let self = this;
      (function(self, color, i) {
        setTimeout(() => {
          self.DOM[color].style.backgroundColor = "black";
          setTimeout(() => {
            self.DOM[color].style.backgroundColor = `${color}`;
            return;
          }, 500);
        }, i * 1000);
      })(self, color, i + 1);
    }
  };

  Game.prototype.checkSequence = function() {
    for (let i = 0; i < this.state.currentUserSequence.length; i++) {
      const userInput = this.state.currentUserSequence[i];
      const gameInput = this.state.sequence[i];
      if (userInput !== gameInput) {
        this.reset();
        return;
      }
    }

    if (this.state.currentUserSequence.length === this.state.level) {
      this.nextRound();
      return;
    }

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
        level: -1,
        currentUserSequence: []
      }
    );
    this.nextRound();
    return;
  };

  const main = new Game(generateSequence(), DOM);
  main.start();
})();
