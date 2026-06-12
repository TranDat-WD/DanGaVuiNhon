const canvas = document.getElementById("theCanvas");
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

let mPosX = 0;
let score = 0;

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
  canvas.height = screenHeight - 100;
});

// Class

class chicken {
  constructor() {
    this.x = Math.random() * (screenWidth - 50) + 50;
    this.y = 30;
    this.say = [
      "Vì hình chữ nhật cũng là một hình bình hành,",
      "hình thang cân, em hãy cho biết tính chất",
      "của hình chữ nhật?",
    ];
    this.spd = 1.5;
    this.ofset = -50;
    this.image = new Image();
    this.image.src = "src/img/chicken.png";
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
    ctx.fillStyle = "rgb(133, 118, 80)";
    if (this.x + this.size + 10 + this.size * 3.2 < screenWidth) {
      ctx.roundRect(
        this.x + this.size + 10,
        this.y - 5 - this.ofset,
        this.size * 3.2,
        this.size * 0.55,
        15,
      );
    } else {
      ctx.roundRect(
        this.x - this.size * 3.2 - 10,
        this.y - 5 - this.ofset,
        this.size * 3.2,
        this.size * 0.65,
        15,
      );
    }
    ctx.fill();
  }

  drawText() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "20px serif";
    let line = 1;
    for (let i of this.say) {
      if (this.x + this.size + 10 + this.size * 3.2 < screenWidth) {
        ctx.fillText(
          String(i),
          this.x + this.size + 20,
          this.y + 20 * line - this.ofset,
          this.size * 5,
        );
      } else {
        ctx.fillText(
          String(i),
          this.x - this.size * 3.2,
          this.y + 20 * line - this.ofset,
          this.size * 5,
        );
      }
      line++;
    }
  }

  draw() {
    if (this.imageLoaded) {
      if (this.spd < 0) {
        this.image.src = "src/img/chicken.png";
      } else {
        this.image.src = "src/img/chicken-fliped.png";
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
    this.say = saysList[Math.floor(Math.random() * 8)];
    this.spd = 1;
    this.image = new Image();
    this.image.src = "src/img/egg.png";
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
      this.x = chicken1.x;
      this.y = chicken1.y + chicken1.size;
      this.say = saysList[Math.floor(Math.random() * 8)];
    } else if (
      this.y >= basket1.y &&
      this.x > basket1.x - basket1.size / 2 &&
      this.x < basket1.x + basket1.size / 2
    ) {
      if (checkAns(this.say) == true) {
        score += 10;
        console.log("score: " + score);
      } else {
        score -= 5;
        console.log("score: " + score);
      }
      this.x = chicken1.x;
      this.y = chicken1.y + chicken1.size;
      this.say = saysList[Math.floor(Math.random() * 8)];
    }
  }

  drawRect() {
    ctx.beginPath();
    ctx.fillStyle = "rgb(133, 118, 80)";
    if (this.x + this.size + 10 + this.size * 5.5 < screenWidth) {
      ctx.roundRect(
        this.x + this.size + 10,
        this.y - this.ofset,
        this.size * 5.5,
        this.size * 1.25,
        15,
      );
    } else {
      ctx.roundRect(
        this.x - this.size * 5.5 - 10,
        this.y - this.ofset,
        this.size * 5.5,
        this.size * 1.25,
        15,
      );
    }
    ctx.fill();
  }

  drawText() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "20px serif";
    let line = 1;
    for (let i of this.say) {
      if (this.x + this.size + 10 + this.size * 5.5 < screenWidth) {
        ctx.fillText(
          String(i),
          this.x + this.size + 20,
          this.y + 20 * line - this.ofset,
          this.size * 5,
        );
      } else {
        ctx.fillText(
          String(i),
          this.x - this.size * 5 - 20,
          this.y + 20 * line - this.ofset,
          this.size * 5,
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
    this.image.src = "src/img/basket.png";
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

// Functions

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  chicken1.update();
  chicken1.draw();
  chicken1.drawRect();
  chicken1.drawText();
  egg1.update();
  egg1.draw();
  egg1.drawRect();
  egg1.drawText();
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

// Events

const saysList = [
  ["Hai cạnh bên bằng nhau"],
  ["Hai đường chéo bằng nhau"],
  ["Các cạnh đối bằng nhau"],
  ["Các góc đối bằng nhau"],
  ["Hai đường chéo cắt nhau", "tại trung điểm mỗi đường"],
  ["Hai cạnh kề bằng nhau"],
  ["Hai đường chéo vuông góc nhau"],
  ["Bốn cạnh bằng nhau"],
];

const chicken1 = new chicken();
const egg1 = new egg(chicken1.x, chicken1.y + chicken1.size);
const basket1 = new basket();
animate();
