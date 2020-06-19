window.onload = () => {
  //Variaveis de escopo global
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let shoots = 1000
  let shootsArr=[]
  let shooting = false;
  let zombiesArmy = [];
  let interval;
  let frames = 0;
  let score = 0;
  const images = {
    backgroundI: "./images/backGround.png",
    plantI: "./images/plant1.png",
    zombieI: "./images/zombie.png",
    shootI: "./images/pea.png",
    gameOverI: "./images/Game_Over.jpg"
  };
  let themeSound = "./sounds/MainTheme.mp3";
  let zombiesAreComingSound = "./sounds/zombiesAreComing.mp3"
  let shootEfect = "./sounds/shoot.ogg"
  let gameOverSound = "./sounds/EndGame.mp3"

// Classes de nossos componentes.

  class BoardGame {
    constructor(img) {
      this.eixoX = 0;
      this.eixoY = 0;
      this.height = 400;
      this.width = 600;
      this.sound = new Audio();
      this.sound.src = themeSound;
      this.sound2 = new Audio();
      this.sound2.src = zombiesAreComingSound;
      this.img = new Image();
      this.img.src = img;
      this.img.onload = () => {
      this.draw();
      };
    }
    draw() {
      ctx.drawImage(this.img, this.eixoX, this.eixoY, canvas.width, canvas.height);
    }
  }
  class Plant {
    constructor(eixoX,eixoY) {
      this.eixoX = eixoX;
      this.eixoY = eixoY;
      this.img = new Image();
      this.img.src = images.plantI;
      this.eixoSX = 0;
      this.eixoSY = 0;
      this.speedX=0;
      this.speedY=0
    }
   
    setShoot(plantShooter){
      shootsArr.unshift(new Bullet(plantShooter,this.eixoX+ 30, this.eixoY+ 10))
    }
    
    
    draw() {
      if (this.eixoSX > 2860) this.eixoSX = 0;
      ctx.drawImage(this.img,this.eixoSX,this.eixoSY,223,185,this.eixoX,this.eixoY,50,60);
      this.eixoSX += 221;
    }
  }

  class Zombie {
    constructor(eixoY) {
      this.eixoX = 650;
      this.eixoY = eixoY;
      this.img = new Image();
      this.img.src = images.zombieI;
      this.eixoSX = 0;
      this.eixoSY = 0;
    }
    draw() {
      if (this.eixoSX > 5500) this.eixoSX = 0;
      ctx.drawImage(this.img,this.eixoSX,this.eixoSY,220,120,this.eixoX,this.eixoY,130,110);
      this.eixoSX += 220;
      this.eixoX -= 2;
      if (this.eixoX < 0) {
        gameOver();
      }
    }
  }

  class GameOver {
    constructor() {
      this.eixoX = 0;
      this.eixoY = 0;
      this.sound = new Audio();
      this.sound.src = gameOverSound;
      this.img = new Image();
      this.img.src = images.gameOverI;
    }
    draw() {
      ctx.drawImage(this.img, this.eixoX, this.eixoY, canvas.width, canvas.height);
    }
  }

  class Bullet {
    constructor(eixoY) {
      this.eixoX = 140;
      this.eixoY = eixoY;
      this.width = 15;
      this.height = 15;
      this.sound = new Audio();
      this.sound.src = shootEfect;
      this.img = new Image();
      this.img.src = images.shootI;
    }
    draw(plantY) {
      ctx.drawImage(this.img, this.eixoX, plantY, this.width, this.height);
      this.eixoX+=5
    }
    move() {
      this.eixoX += 5;
    }
    
    colisions(obstacle) {
      return !
        this.eixoX < obstacle.eixoX + 220 &&
        this.eixoX + 15 > obstacle.eixoX + 80 &&
        this.eixoY < obstacle.eixoY + 117 &&
        this.eixoY + 15 > obstacle.eixoY
      ;
    }
  }

  // Variveis encapsuladas
//  const ball = new Bullet((balls()));
  const board = new BoardGame(images.backgroundI);
  const endGame= new GameOver();
  const plant = new Plant(100,150);
 
  // Funções 

  function update() {
    ctx.clearRect(0, 0, 600, 400);
    board.draw();
    plant.draw()
    // ball.draw();
    summonZombies(zombiesArmy);
    frames++;

    if (frames % 20 === 0) {
      zombiesArmy.unshift(new Zombie(randomPosition()));
    }
    if(shoots < 0){
      shoots = 0
    } else if (shoots > 0){
      shootsArr.forEach(ball => {
        ball.draw(plant.eixoY);
        ball.move();
      });
    }
    checkColision(); 
  }
  function randomPosition() {
    let yPositions = [15, 75, 160, 230, 300];
    let randonY = yPositions[Math.floor(Math.random() * yPositions.length)];
    return randonY;
  }

function buttonDisable() {
    document.getElementById("plant").style.visibility = "hidden";
    start();
  }
  function start() {
    if (interval) return;
    interval = setInterval(update, 1000 / 20);
    board.sound.play()
    board.sound2.play() 
  }

  function summonZombies(zombiesArmy) {
    zombiesArmy.slice(0, 30).forEach(zombie => {
      zombie.draw();
    });
  }

  function gameOver() {
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    endGame.draw();
    board.sound.pause();
    endGame.sound.play()
  }

  function shoot() {
    shootsArr.push(new Bullet());
    shoots --
  }

  function checkColision() {
    zombiesArmy.map((zombie, zombieIndex) => {
      shootsArr.map((shoot, shootIndex) => {
        if (shoot.colisions(zombie)) {
          shootsArr.splice(shootIndex, 1);
          zombiesArmy.splice(zombieIndex, 1);
          score ++
          
        }
      });
    });
  }

  function reset(){
    window.location.reload();
  }


// DOM

  document.getElementById("plant").onclick = function() {
    buttonDisable();
  };

  document.getElementById("reset").onclick = function() {
    reset();
  }

  document.addEventListener("keydown", e => {
    switch (e.keyCode) {
      case 83: // S to move Down
       plant.eixoY +=20;
      //  ball.eixoY +=20;
        break;
      case 87: // W to move Up
       plant.eixoY -= 20;
      //  ball.eixoY -=20;
        break;
      case 70:  //F to Shoot
       shoot()
        break;
      default:
        break;
    }
  });
};
