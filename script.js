"use strict"

let start=document.createElement('input');
document.body.appendChild(start);
start.type="button";
start.value="START";
start.setAttribute('onclick','startGame()');
start.id='start';

let scoreNum = {
    L:0,
    R:0
}
let score=document.createElement('div');
document.body.appendChild(score);
score.innerHTML="SCORE: " + scoreNum.L + ' : ' + scoreNum.R;
score.id='score';

const svgOptions = {
    svgW: 600,
    svgH: 300,

    gameBoardLeftW: 5,
    gameBoardLeftH: 50,
    gameBoardLeftSpeed: 5,

    gameBoardRightW: 5,
    gameBoardRightH: 50,
    gameBoardRightSpeed: 5,

    ballRadius: 15
}

let svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
document.body.appendChild(svg);
svg.setAttribute('width',svgOptions.svgW);
svg.setAttribute('height',svgOptions.svgH);

let gameArea=document.createElementNS("http://www.w3.org/2000/svg","rect");
svg.appendChild(gameArea);
gameArea.setAttribute('width',svgOptions.svgW);
gameArea.setAttribute('height',svgOptions.svgH);
gameArea.id='gameArea';

let gameBoardLeft=document.createElementNS("http://www.w3.org/2000/svg","rect");
svg.appendChild(gameBoardLeft);
gameBoardLeft.setAttribute('x',0);
gameBoardLeft.setAttribute('y',svgOptions.svgH/2-svgOptions.gameBoardLeftH/2);
gameBoardLeft.setAttribute('width',svgOptions.gameBoardLeftW);
gameBoardLeft.setAttribute('height',svgOptions.gameBoardLeftH);
gameBoardLeft.id='gameBoardLeft';

let gameBoardRight=document.createElementNS("http://www.w3.org/2000/svg","rect");
svg.appendChild(gameBoardRight);
gameBoardRight.setAttribute('x',svgOptions.svgW-svgOptions.gameBoardRightW);
gameBoardRight.setAttribute('y',svgOptions.svgH/2-svgOptions.gameBoardRightH/2);
gameBoardRight.setAttribute('width',svgOptions.gameBoardRightW);
gameBoardRight.setAttribute('height',svgOptions.gameBoardRightH);
gameBoardRight.id='gameBoardRight';

let ball=document.createElementNS("http://www.w3.org/2000/svg","circle");
svg.appendChild(ball);
ball.setAttribute('cx',svgOptions.svgW/2);
ball.setAttribute('cy',svgOptions.svgH/2);
ball.setAttribute('r',svgOptions.ballRadius);
ball.id='ball';



const moveBoard = {

    speedLeft: 0,
    speedRight: 0,
    yL: svgOptions.svgH/2 - svgOptions.gameBoardLeftH/2,
    yR: svgOptions.svgH/2 - svgOptions.gameBoardRightH/2,

    updateL:function () {
        if (
            ((this.yL + this.speedLeft)<0) ||
            ((this.yL + this.speedLeft)>svgOptions.svgH-svgOptions.gameBoardLeftH)
        ){
            this.speedLeft = 0;
        } else {
            gameBoardLeft.setAttribute('y', this.yL + this.speedLeft);
            this.yL += this.speedLeft;
        }
    },

    updateR:function () {
        if (
            ((this.yR + this.speedRight)<0) ||
            ((this.yR + this.speedRight)>svgOptions.svgH-svgOptions.gameBoardRightH)
        ){
            this.speedRight = 0;
        } else {
            gameBoardRight.setAttribute('y', this.yR + this.speedRight);
            this.yR += this.speedRight;
        }
    }
}

document.onkeydown = function (eo) {
    if(eo.keyCode === 16) {
        moveBoard.speedLeft=-svgOptions.gameBoardLeftSpeed;
    }
    if (eo.keyCode === 17) {
        moveBoard.speedLeft=svgOptions.gameBoardLeftSpeed;
    }
    if(eo.keyCode === 38) {
        moveBoard.speedRight=-svgOptions.gameBoardRightSpeed;
    }
    if (eo.keyCode === 40) {
        moveBoard.speedRight=svgOptions.gameBoardRightSpeed;
    }
}

document.onkeyup = function (eo) {
    if(eo.keyCode === 16) {
        moveBoard.speedLeft=0
    }
    if (eo.keyCode === 17) {
        moveBoard.speedLeft=0
    }
    if(eo.keyCode === 38) {
        moveBoard.speedRight=0
    }
    if (eo.keyCode === 40) {
        moveBoard.speedRight=0
    }
}

const ballMove = {
    speedX:-10,
    speedY:0,
    x:svgOptions.svgW/2,
    y:svgOptions.svgH/2,

    update:function () {//шарик дошёл до левого края
        if (((this.x - svgOptions.ballRadius - svgOptions.gameBoardLeftW + this.speedX) <= 0) ||
                        //шарик дошёл до правого края
        (((this.x + this.speedX)) >= (svgOptions.svgW - svgOptions.ballRadius - svgOptions.gameBoardRightW))) {

            if (this.speedX < 0) {//шарик летит влево
                                // верхний край левой ракетки
                if ((this.y >= moveBoard.yL) &&
                                // нижний край левой ракетки
                (this.y <= (moveBoard.yL + svgOptions.gameBoardLeftH))) {
                                // дожимаем шарик к ракетке
                    ball.setAttribute('cx',svgOptions.gameBoardLeftW + svgOptions.ballRadius);
                    this.x = svgOptions.gameBoardLeftW + svgOptions.ballRadius;
                                // отскок от ракетки
                    this.speedX = -this.speedX;
                                // продолжаем
                    setTimeout(game,40);
                                // подкрутка левой ракеткой
                    if (moveBoard.speedLeft<0)
                        this.speedY-=3;
                    else if (moveBoard.speedLeft>0)
                        this.speedY+=3;
                } else {
                    // дожимаем шарик к стене
                    ball.setAttribute('cx',svgOptions.ballRadius);
                    // остановка
                    this.speedX = 0;
                    this.speedY = 0;
                    // меняем счёт
                    scoreNum.R++;
                    score.innerHTML="SCORE: " + scoreNum.L + ' : ' + scoreNum.R;
                    start.disabled="";
                }
            } else {//шарик летит вправо
                                // верхний край правой ракетки
                if ((this.y >= moveBoard.yR) &&
                                // нижний край правой ракетки
                (this.y <= (moveBoard.yR + svgOptions.gameBoardRightH))) {
                                // дожимаем шарик к ракетке
                    ball.setAttribute('cx',svgOptions.svgW - svgOptions.gameBoardRightW - svgOptions.ballRadius);
                    this.x = svgOptions.svgW - svgOptions.gameBoardRightW - svgOptions.ballRadius;
                                // отскок от ракетки
                    this.speedX = -this.speedX;
                                // продолжаем
                    setTimeout(game,40);
                                // подкрутка правой ракеткой
                    if (moveBoard.speedRight<0)
                        this.speedY-=3;
                    else if (moveBoard.speedRight>0)
                        this.speedY+=3;
                } else {
                    // дожимаем шарик к стене
                    ball.setAttribute('cx',svgOptions.svgW - svgOptions.ballRadius);
                    // остановка
                    this.speedX = 0;
                    this.speedY = 0;
                    
                    scoreNum.L++;
                    score.innerHTML="SCORE: " + scoreNum.L + ' : ' + scoreNum.R;
                    start.disabled="";
                }
            }
        } else {//отскок от потолка
            if ((ballMove.y - svgOptions.ballRadius < 0)
            ||//отскок от потолка
            (ballMove.y + svgOptions.ballRadius > svgOptions.svgH)) {
                this.speedY = -this.speedY;
            }
            //движение прямо, если нет препядствия
            ball.setAttribute('cx',this.x + this.speedX);
            ball.setAttribute('cy',this.y + this.speedY);
            this.x+=this.speedX;
            this.y+=this.speedY;
            
            // продолжаем
            setTimeout(game,40);
        }
    }
}

function randomDiap(n,m) {
    return Math.floor(Math.random()*(m-n+1))+n;
}

function startGame() {
    // прячем кнопку
    start.disabled="disabled";
    // ракетки на позиции
    gameBoardLeft.setAttribute('y',svgOptions.svgH/2-svgOptions.gameBoardLeftH/2);
    moveBoard.yL = svgOptions.svgH/2-svgOptions.gameBoardLeftH/2;
    gameBoardRight.setAttribute('y',svgOptions.svgH/2-svgOptions.gameBoardRightH/2);
    moveBoard.yR = svgOptions.svgH/2-svgOptions.gameBoardRightH/2;
    // шарик на центр
    ball.setAttribute('cx',svgOptions.svgW/2);
    ball.setAttribute('cy',svgOptions.svgH/2);
    ballMove.x = svgOptions.svgW/2;
    ballMove.y = svgOptions.svgH/2;
    // определяем случайную скорость и направление шарика
    ballMove.speedX=randomDiap(-5,5);
    ballMove.speedY=randomDiap(-1,1);

    setInterval(()=>ballMove.speedX++,15000);//увеличиваем скорость через интервал

    setTimeout(game,3000);
}

function game() {
    moveBoard.updateL();
    moveBoard.updateR();
    ballMove.update();
}
