const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
canvas.width = window.screen.width;
canvas.height = window.screen.height;

let pX = canvas.width/10;
let pY = canvas.height/10*5;
let pXS = 0;
let pYS = 0;
let pSize = canvas.width/25;
let pSpeed = 7;
let fps_data = [];
let stageData = [];
let gravityPower = -3;
let isJump = false;
let isOnStage = false;

const jumpMaxCount = 50
let jumpPower = 10;
let jumpCount = 0;

stageData.push({pos:[0,canvas.height/10*9,canvas.width,canvas.height/10*9],color:"Brown"});
stageData.push({pos:[canvas.width/10*5,canvas.height/10*7,canvas.width/10,canvas.height/10],color:"Brown"});

let down_key = [];

document.addEventListener("keydown",function(event){
    down_key.includes(event.key) ? 0 : down_key.push(event.key);
})

document.addEventListener("keyup",function(event){
    down_key.splice(down_key.indexOf(event.key),1);
})

function spawn(){
    pX = canvas.width/10;
    pY = canvas.height/10*5;
}

function isNeedSpawn(){
    if(pX + pSize/2 < 0){
        spawn();
    }
}

function clear(){
    context.clearRect(0,0,canvas.width,canvas.height)
}

function drowStage(){
    for(let d of stageData){
        context.fillStyle =d.color;
        context.fillRect(...d.pos);
    }
}

function drowPlayer(x,y,color){
    context.fillStyle = color;
    context.fillRect(x-(pSize)/2,y-(pSize)/2,pSize,pSize);
}

function drowText(text,x,y,color,max=1000){
    context.fillStyle = color;
    context.font = "20px serif";
    context.fillText(text,x,y,max)
}

function setPlayerPos(){
    let [ex,ey] = [pX + pXS,pY];
    let out = stageData.filter(d=>ex > d.pos[0] - pSize/2 && d.pos[0] + d.pos[2] + pSize/2 > ex &&  ey + pSize/2 > d.pos[1] && d.pos[1] + d.pos[3] > ey - pSize/2);
    if(out.length === 0){
        pX += pXS;
        pXS *= 0.89;
    }else{
        pXS = 0;
    }
    pY += pYS;
    pYS *= 0.89;
}

function fpsCountor(){
    fps_data.push(Date.now());
    fps_data = fps_data.filter(d=>Date.now() - d < 1000);
    drowText(`FPS: ${fps_data.length}`,canvas.width/10,canvas.width/10,"Black");
    requestAnimationFrame(fpsCountor);
}

function playerProcess(){
    if(down_key.includes("ArrowRight")){
        pXS = pSpeed;
    }if(down_key.includes("ArrowLeft")){
        pXS = -pSpeed;
    }if(down_key.includes("ArrowUp")){
        if(!isJump && isOnStage){
            const jumpSound = new Audio("sound/jump.mp3");
            jumpSound.play();
            isJump = true;
            isOnStage = false;
            jumpCount = 0;
        }
    }
}

function jump(){
    if(isJump){
        let [ex,ey] = [pX,pY - (jumpMaxCount - jumpCount) / jumpMaxCount * jumpPower];
        let out = stageData.filter(d=>ex > d.pos[0] - pSize/2 && d.pos[0] + d.pos[2] + pSize/2 > ex &&  ey + pSize/2 > d.pos[1] && d.pos[1] + d.pos[3] > ey - pSize/2);
        if(out.length > 0){
            isJump = false;
            isOnStage = false;
            return;
        }
        pY -= (jumpMaxCount - jumpCount) / jumpMaxCount * jumpPower;
        jumpCount ++;
    }
}

function gravityProcess(){
    if(!isJump){
        gravityPower -= 0.2;
        let [ex,ey] = [pX,pY - gravityPower];
        let out = stageData.filter(d=>ex > d.pos[0] - pSize/2 && d.pos[0] + d.pos[2] + pSize/2 > ex &&  ey + pSize/2 > d.pos[1] && d.pos[1] + d.pos[3] > ey - pSize/2);
        if(out.length === 0){
            pY -= gravityPower;
            isOnStage = false;
        }else{
            gravityPower = -1;
            isOnStage = true;
        }
    }
}

function main(){
    clear();
    drowStage();
    playerProcess();
    setPlayerPos();
    gravityProcess();
    jump();
    drowPlayer(pX,pY,"blue");
    isNeedSpawn();
}

requestAnimationFrame(fpsCountor);
setInterval(main,1000 / 60);
