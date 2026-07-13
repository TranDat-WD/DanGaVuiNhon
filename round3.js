const canvas = document.getElementById("theCanvas");
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

const socket = io();

const pScore = document.querySelector("#pScore");
const beginBtn = document.getElementById("beginBtn");
const hostBtn = document.getElementById("hostButton");

let mPosX = 0;
let score = 0;

const uid = localStorage.getItem("playerId");
const adress = localStorage.getItem("playerRoom");

const ctx = canvas.getContext("2d");

canvas.width = screenWidth;
canvas.height = screenHeight;

document.addEventListener("mousemove", function (event) {
  mPosX = event.clientX;
});

window.addEventListener("resize", () => {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  canvas.width = screenWidth;
  canvas.height = screenHeight;
});

// Class

class chicken {
  constructor() {
    this.x = Math.random() * (screenWidth - 50) + 50;
    this.y = 30;
    this.say = [
      "Vì hình chữ nhật cũng là",
      "một hình bình hành, hình",
      "thang cân, em hãy cho biết",
      "tính chất của hình chữ nhật?",
    ];
    this.spd = 1.5;
    this.ofset = 20;
    this.image = new Image();
    this.image.src = "src/img/round3/chicken.png";
    this.imageLoaded = false;
    this.size = 125;

    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  update() {
    this.x = this.x + this.spd;

    // Kiểm tra va chạm biên
    if (this.x < 0 || this.x + this.size > canvas.width) {
      this.spd = -this.spd;
    }
  }

  drawRect() {
    ctx.beginPath();
    ctx.fillStyle = "rgb(229, 224, 211)";
    if (this.x + this.size + 10 + this.size * 3.2 < screenWidth) {
      ctx.roundRect(
        this.x + this.size + 10,
        this.y - 5 - this.ofset,
        this.size * 3.35,
        this.size * 1.25,
        15,
      );
    } else {
      ctx.roundRect(
        this.x - this.size * 3.2 - 10,
        this.y - 5 - this.ofset,
        this.size * 3.35,
        this.size * 1.25,
        15,
      );
    }
    ctx.fill();
  }

  drawText() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.font = "36px serif";
    let line = 1;
    for (let i of this.say) {
      if (this.x + this.size + 10 + this.size * 3.2 < screenWidth) {
        ctx.fillText(
          String(i),
          this.x + this.size + 20,
          this.y + 32 * line - this.ofset,
          this.size * 5,
        );
      } else {
        ctx.fillText(
          String(i),
          this.x - this.size * 3.2,
          this.y + 32 * line - this.ofset,
          this.size * 5,
        );
      }
      line++;
    }
  }

  draw() {
    if (this.imageLoaded) {
      if (this.spd < 0) {
        this.image.src = "src/img/round3/chicken.png";
      } else {
        this.image.src = "src/img/round3/chicken-fliped.png";
      }
      ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}

class egg {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.say = saysList[quotePos];
    this.spd = 2;
    this.image = new Image();
    this.image.src = "src/img/round3/egg.png";
    this.imageLoaded = false;
    this.size = 40;
    this.ofset = 25;

    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  update() {
    this.y = this.y + this.spd;
    if (this.y < 0 || this.y + this.size > canvas.height) {
      saysList.splice(quotePos, 1);
      if (saysList.length != 0) {
        quotePos = Math.floor(Math.random() * saysList.length);
        this.say = saysList[quotePos];
        this.x = chicken1.x;
        this.y = chicken1.y + chicken1.size;
      }
    } else if (
      this.y >= basket1.y &&
      this.x > basket1.x - basket1.size / 2 &&
      this.x < basket1.x + basket1.size / 2
    ) {
      if (checkAns(this.say) == true) {
        score += 10;
        checks.push(new check(basket1.x + basket1.size / 2, basket1.y, true));
        setTimeout(() => {
          checks.splice(0, 1);
        }, 1000);
        pScore.textContent = "Điểm: " + score;
      } else {
        score -= 5;
        checks.push(new check(basket1.x + basket1.size / 2, basket1.y, false));
        setTimeout(() => {
          checks.splice(0, 1);
        }, 1000);
        pScore.textContent = "Điểm: " + score;
      }
      saysList.splice(quotePos, 1);
      if (saysList.length != 0) {
        quotePos = Math.floor(Math.random() * saysList.length);
        this.say = saysList[quotePos];
        this.x = chicken1.x;
        this.y = chicken1.y + chicken1.size;
      }
    }
  }

  drawRect() {
    ctx.beginPath();
    ctx.fillStyle = "rgb(229, 224, 211)";
    if (this.x + this.size + 10 + this.size * 5.5 < screenWidth) {
      ctx.roundRect(
        this.x + this.size + 10,
        this.y - this.ofset,
        this.size * 7,
        this.size * 1.5,
        15,
      );
    } else {
      ctx.roundRect(
        this.x - this.size * 7 - 10,
        this.y - this.ofset,
        this.size * 7,
        this.size * 1.5,
        15,
      );
    }
    ctx.fill();
  }

  drawText() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.font = "30px serif";
    let line = 1;
    for (let i of this.say) {
      if (this.x + this.size + 10 + this.size * 5.5 < screenWidth) {
        ctx.fillText(
          String(i),
          this.x + this.size + 20,
          this.y + 25 * line - this.ofset,
          this.size * 6.5,
        );
      } else {
        ctx.fillText(
          String(i),
          this.x - this.size * 6.5 - 20,
          this.y + 25 * line - this.ofset,
          this.size * 6.5,
        );
      }
      line++;
    }
  }

  draw() {
    if (this.imageLoaded) {
      ctx.drawImage(this.image, this.x, this.y, this.size, this.size * 1.25);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}

class basket {
  constructor() {
    this.x = mPosX;
    this.y = 550;
    this.image = new Image();
    this.image.src = "src/img/round3/basket.png";
    this.imageLoaded = false;
    this.size = 125;

    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  update() {
    this.x = mPosX;
  }

  draw() {
    if (this.imageLoaded) {
      ctx.drawImage(
        this.image,
        this.x - this.size / 2,
        this.y,
        this.size,
        this.size,
      );
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}

class check {
  constructor(x, y, answer) {
    this.x = x;
    this.y = y;
    this.answer = answer;
  }
  draw() {
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "bold 50px serif";
    if (this.answer == true) {
      ctx.fillText("+10", this.x, this.y);
    } else {
      ctx.fillText("-5", this.x, this.y);
    }
  }
}

// Functions

async function roundChange(round) {
  const response = await fetch("/changeRound", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomAdress: adress,
      round: round,
    }),
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  chicken1.update();
  chicken1.draw();
  chicken1.drawRect();
  chicken1.drawText();
  if (started == true && saysList.length > 0) {
    egg1.update();
    egg1.draw();
    egg1.drawRect();
    egg1.drawText();
  }
  for (let i in checks) {
    checks[i].draw();
  }
  basket1.update();
  basket1.draw();
  requestAnimationFrame(animate);
}

function checkAns(ans) {
  let strAns = "";
  for (let i in ans) {
    strAns += ans[i] + " ";
  }
  strAns = strAns.trim();
  const answer = [
    "Hai cạnh bên bằng nhau",
    "Hai đường chéo bằng nhau",
    "Các cạnh đối bằng nhau",
    "Các góc đối bằng nhau",
    "Hai đường chéo cắt nhau tại trung điểm mỗi đường",
  ];
  for (let i in answer) {
    if (strAns === answer[i]) {
      return true;
    }
  }
  return false;
}

async function updScore(finalScore) {
  const response = await fetch("/updateScore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid: uid,
      roomAdress: adress,
      score: finalScore,
    }),
  });

  const result = await response.json();
  console.log(result.score);
}

// Events

const checks = [];
let started = false;

const saysListOriginal = [
  ["Hai cạnh bên bằng nhau"],
  ["Hai đường chéo bằng nhau"],
  ["Các cạnh đối bằng nhau"],
  ["Các góc đối bằng nhau"],
  ["Hai đường chéo cắt nhau", "tại trung điểm mỗi đường"],
  ["Hai cạnh kề bằng nhau"],
  ["Hai đường chéo vuông góc nhau"],
  ["Bốn cạnh bằng nhau"],
];

let saysList = [...saysListOriginal];
let quotePos = Math.floor(Math.random() * saysList.length);

const chicken1 = new chicken();
const egg1 = new egg(chicken1.x, chicken1.y + chicken1.size);
const basket1 = new basket();
animate();

beginBtn.addEventListener("click", () => {
  if (started == false) {
    started = true;
    saysList = [...saysListOriginal];
    quotePos = Math.floor(Math.random() * saysList.length);
    egg1.x = chicken1.x;
    egg1.y = chicken1.y + chicken1.size;
    egg1.say = saysList[quotePos];
    beginBtn.innerText = "Dừng trò chơi";
  } else {
    started = false;
    beginBtn.innerText = "Bắt đầu trò chơi";
  }
});

if (uid == 1) {
  hostBtn.style.opacity = 1;
  hostBtn.style.pointerEvents = "all";
}

socket.on("roundChangeS", (data) => {
  const adrs = data.adress;
  const round = data.round;
  if (adress == adrs) {
    localStorage.setItem("playerId", uid);
    localStorage.setItem("playerRoom", adress);
    updScore(score);
    window.location.href = `/round${round}`;
  }
});

hostBtn.addEventListener("click", () => {
  roundChange(4);
});
