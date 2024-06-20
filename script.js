window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;
    const enemies = [];
    const enemyPositions=[];
    const enemies2=[];
    const projectiles=[];
    let startNewGame = document.createElement('button');
    
    startNewGame.innerHTML='Play-Again';
    let score = 0;
    let frame = 0;
    const controlsBar={
        width : canvas.width,
        height :100
    }
    let shootEnemy= false;
    let rightTurn = true; //Just a Default
    let leftTurn = false;
    let pauseBtn = document.getElementById('pause');
    let ispaused = false;
    let restartBtn = document.getElementById('restart');
 
    const mouse={
        x:10,
        y:10,
        width:0.1,
        height:0.1
    }
    //Input-Handler
    class InputHandler {
        constructor(game){
            this.game = game;
            window.addEventListener('keydown',(e)=>{
                this.game.lastKey = 'P'+e.key;
                console.log(this.game.lastKey);
            })
            window.addEventListener('keyup',(e)=>{
                this.game.lastKey = 'R'+e.key;
                console.log(this.game.lastKey);
            })
        }
    }
    canvas.addEventListener('click',function(e){
        mouse.x= e.x;
        mouse.y= e.y;
        console.log(mouse.x);
    })

    

    //Projectiles
    class Projectile {
        constructor(x,y){
            this.x = x;
            this.y = y;
            this.height = 5;
            this.width = 5;
            this.power= 100;
            this.speedX = 5;
            this.speedY = -10
            this.maxX= 600;
            this.minY = 50;
            this.gravity = 0.1;
        }
        update(){
       if(rightTurn){
        this.x+= this.speedX;
        this.y += this.speedY;
        this.speedY += 0.2;
       }
      else if(leftTurn){
        this.x-= this.speedX;
        this.y += this.speedY;
        this.speedY += 0.2;
      }
  
      
      
         

        }
        draw(){
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width, 0 ,Math.PI*2);
            ctx.fill();
          
        }
    }
    function handleProjectiles(){
        for(let i=0 ; i< projectiles.length ; i++){
            projectiles[i].update();
            projectiles[i].draw();
            for(let j=0 ; j <enemies.length ;j++){
                if(enemies[j] && projectiles[i] && collision(projectiles[i],enemies[j])){
                    enemies[j].health -= projectiles[i].power;
                    projectiles.splice(i,1);
                    i--;
                }
              }
            for(let k= 0 ; k<enemies2.length ; k++){
                if(enemies2[k] && projectiles[i] && collision(projectiles[i],enemies2[k])){
                    enemies2[k].health -= projectiles[i].power;
                    projectiles.splice(i,1);
                    i--;
                }
            }
            if(projectiles[i] && projectiles[i].x> canvas.width){
                projectiles.splice(i, 1);
                i--;
            }
           
        }
    }
    
    //Shooter
    class Shooter {
        constructor( game){
            this.game = game;
            this.width= 200;
            this.height= 20;
            this.x= 500;
            this.y= 50;
            this.timer= 0 ;
            this.shooting = true;
        }
  
        draw(context){
            context.fillRect(this.x, this.y, this.width,this.height); 
        }
        update(){
            if(this.shooting){
                this.timer++;
                if(this.timer % 50 == 0){
                    ;
                }
            }
        }
    }
 
    //Defence
    class Defence {
        constructor(game,x ,y){
            this.game = game;
            this.width = 100;
            this.height =100;
            this.x=x;
            this.y = y;
            this.health = 300;
        }
        draw(context){
            ctx.fillStyle='black'
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle="gold";
            ctx.font="15px Arial"
            ctx.fillText(Math.floor(this.health),this.x + 15 ,this.y + 25);
        }
    }


    //Soldier
    class Soldier{
        constructor(game){
            this.game = game;
            this.width = 100;
            this.height =100;
            this.x = 600;
            this.y = 350;
            this.speedX = 0;
            this.speedY = 0;
            this.frameX=0;
            this.frameY=5;
            this.maxSpeed=10;
            this.mspeedY = -5;
            this.image = document.getElementById('owlbear');
            this.spriteHeight=200;
            this.spriteWidth=200;
            this.timer=0;
            this.shooting = true;
            this.health = 100;
            this.power = 100;
        }
        draw(){
            //context.fillRect(this.x, this.y, this.width,this.height);
            ctx.drawImage(this.image,this.frameX * this.spriteWidth,this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,this.x, this.y,this.width,this.height);
            ctx.fillStyle='black';
            ctx.font="15px Arial"
            ctx.fillText(Math.floor(this.health),this.x+35 ,this.y - 5);

        }
        setSpeed(speedX, speedY){
          this.speedX = speedX;
          this.speedY = speedY;
        }
        update(){
          if(this.shooting){
            this.timer++;
            if(this.timer % 100 ==0){
                projectiles.push(new Projectile(this.x+50,this.y+50));
                
            }
          }
           
           if(this.game.lastKey == 'PArrowLeft'){
            rightTurn =false;
            leftTurn = true;
              this.setSpeed(-this.maxSpeed,0);
              this.frameY = 3;
}
else if(this.game.lastKey == 'PArrowRight'){
rightTurn = true;
leftTurn = false;
this.setSpeed(this.maxSpeed,0);
this.frameY = 5;
}
else if(this.game.lastKey=='PArrowUp'){
   if(this.mspeedY< 5.5){
    this.setSpeed(0,this.mspeedY);
    this.mspeedY+= 0.2
   }
    else{
        this.y = 350;
        this.mspeedY = -5;
    }
}
else if( this.game.lastKey == 'RArrowUp'){
    this.y = 350;
}



else{
            this.setSpeed(0,0);
           }
           this.x += this.speedX;
           this.y += this.speedY;

//horizontal-boundaries
if(this.x < 0){
    this.x=0;
}
else if(this.x> this.game.width - this.width){
    this.x = this.game.width- this.width
}
//vertical-boundaries
if(this.y < this.game.topMargin){
    this.y = this.game.topMargin;
}
else if( this.y> this.game.height - this.height){
    this.y = this.game.height - this.height
}
        
        }
    }

    function handleSoldier(){
        for(let i=0 ; i<enemies.length ; i++){
            if(game.soldier && collision(game.soldier,enemies[i])){
                enemies[i].movement = 0;
                game.soldier.health -=10;
                enemies[i].health -= game.soldier.power;
            }
            if(game.soldier && game.soldier.health <= 0){
                game.soldier.health = 0;
              
                enemies[i].movement = enemies[i].speed;
            }
        }
      
    }
    function handleSoldier2(){
        for(let i=0 ; i<enemies2.length ; i++){
            if(game.soldier && collision(game.soldier,enemies2[i])){
                enemies2[i].movement = 0;
                game.soldier.health -=10;
                enemies2[i].health -= game.soldier.power;
            }
            if(game.soldier && game.soldier.health <= 0){
                game.soldier.health = 0;
                
                enemies2[i].movement = enemies2[i].speed;
            }
        }
    }
    //Floating Messages
    const floatingMessages=[];
    class FloatingMessages{
        constructor(value, x,y,size,color){
            this.value = value;
            this.x= x;
            this.y =y;
            this.size =size;
            this.lifespan=0;
            this.color= color;
            this.opacity=1
        }
        update(){
            this.y -= 0.3;
            this.lifespan +=1;
            if(this.opacity > 0.01) this.opacity -=0.01;
        }
        draw(){
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle= this.color;
            ctx.font = this.size + 'cursive';
            ctx.fillText(this.value, this.x , this.y);
            ctx.globalAlpha = 1;
        }
    }
    function handleFloatingMessages(){
        for(let i=0 ;i<floatingMessages.length ; i++){
            floatingMessages[i].update();
            floatingMessages[i].draw();
            if(floatingMessages[i].lifespan >= 50){
                floatingMessages.splice(i,1);
                i--;
            }
        }
    }

    //Enemy
    class Enemies{
        constructor(){
            this.x = canvas.width;
            this.y = 350;
            this.width = 100;
            this.height = 100;
            this.speed = Math.random()*0.2 + 0.4;
            this.movement = this.speed;
            this.health = 100;
            this.maxHealth = this.health;
            this.image = document.getElementById('enemy1');
        }
        update(){
            this.x -= this.movement;
        }
        draw(){
            ctx.fillStyle='red';
            ctx.fillRect(this.x,this.y,this.width,this.height);
            ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
            ctx.fillStyle='black';
            ctx.font="15px Arial"
            ctx.fillText(Math.floor(this.health),this.x + 15 ,this.y + 25);
        }
    }
    class Enemies2{
        constructor(){
            this.x =0;
            this.y = 350;
            this.width = 100;
            this.height = 100;
            this.speed = Math.random()*0.2 + 0.4;
            this.movement = this.speed;
            this.health = 100;
            this.maxHealth = this.health;
            this.image = document.getElementById('enemy2');
        }
        update(){
            this.x += this.movement;
        }
        draw(){
            ctx.fillStyle='red';
            ctx.fillRect(this.x,this.y,this.width,this.height);
            ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
            ctx.fillStyle='black';
            ctx.font="15px Arial"
            ctx.fillText(Math.floor(this.health),this.x + 15 ,this.y + 25);
        }
    }
   function handleEnemies(){
     for(let i=0 ; i<enemies.length ; i++){
        enemies[i].update();
        enemies[i].draw();
        if(enemies[i].health <= 0){
            let gainedResources = enemies[i].maxHealth/10;
            floatingMessages.push(new FloatingMessages('+'+ gainedResources,enemies[i].x,enemies[i].y,45,'gold'));
            floatingMessages.push(new FloatingMessages('+'+ gainedResources,145,35,45,'gold'));
            score+= gainedResources;
            enemies.splice(i,1);
            i--;
        }
     }
     if(frame % 1000 == 0 ){
        enemies.push(new Enemies());
        
     }



   }
   function handleEnemies2(){
    for(let i=0 ; i<enemies2.length ; i++){
       enemies2[i].update();
       enemies2[i].draw();
       if(enemies2[i].health <= 0){
        let gainedResources2 = enemies2[i].maxHealth/10;
        floatingMessages.push(new FloatingMessages('+'+ gainedResources2,enemies2[i].x,enemies2[i].y,45,'gold'));
        floatingMessages.push(new FloatingMessages('+'+ gainedResources2,145,35,45,'gold'));
        score+= gainedResources2;
        enemies2.splice(i,1);
        i--;
    }
       
    }
    if(frame % 1200 == 0 ){
       enemies2.push(new Enemies2());
       
    }



  }
    //Game
    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.topMargin= 200 ;
            this.lastKey = undefined;
            this.input = new InputHandler(this);
            this.soldier = new Soldier(this);
            this.shooter = new Shooter(this);
            this.defences = new Defence(this, 480, 350);
            this.defences2 = new Defence(this, 720, 350);
           
        }
        render(context){
           
            this.defences.draw(context);
            this.defences2.draw(context);
            this.shooter.draw(context);
           if(this.soldier){
            this.soldier.draw(context);
            this.soldier.update();
           }
           else {
            this.soldier = new Soldier(this);
           }
           
            
            for(let i=0; i<enemies2.length ; i++){
                if(this.defences && enemies2[i] && collision(this.defences, enemies2[i])){
                    enemies2[i].movement = 0;
                    this.defences.health -= 1;
                    if(this.defences && this.defences.health<=0){
                        this.defences.health = 0;
                        enemies2[i].movement = enemies2[i].speed;
                       
                    }
                }
            }
            for(let i=0; i<enemies.length ; i++){
                if(this.defences2 && enemies[i] && collision(this.defences2, enemies[i])){
                    enemies[i].movement = 0;
                    this.defences2.health -= 1;
                    if(this.defences2 && this.defences2.health<=0){
                        this.defences2.health = 0;
                        enemies[i].movement = enemies[i].speed;
                        
                    }
                }

            }

          
            
        }
    }
    document.addEventListener('keydown',handleKeyPressed);
   document.addEventListener('keyup',handleReleased);
   function handleKeyPressed(event){
     switch( event.key){
        case ' ':
            shootEnemy = true;
            rightShoot= false;
            leftShoot = false;
      

        
        default :
         break
     }
   }
   function handleReleased(event){
    switch( event.key){
       case ' ':
           shootEnemy = false;
          
       
       default :
        break
    }
  }
  function handleGameStatus(){
   ctx.fillStyle='lightblue';
   ctx.fillRect(0,0,canvas.width,100);
   ctx.fillStyle='black';
   ctx.font='20px monospace';
   ctx.fillText('Score:'+ score,20,35);
   ctx.fillText('Health:'+game.soldier.health,20,65);

  }

    const game = new Game(canvas.width, canvas.height);
  
    function animate(){
        ctx.fillStyle = "blue";
        ctx.fillRect(0,0,controlsBar.width,controlsBar.height);
        ctx.fillStyle='gold';
        ctx.font = '30px monospace';
        ctx.fillText('Score', 20 , 35);
        
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.render(ctx);
        frame++;
        handleGameStatus();
        handleFloatingMessages();
        handleSoldier();
        handleSoldier2();
        handleEnemies2();
        handleEnemies();
        if(shootEnemy ){
            handleProjectiles();
        }
       
       
        restartBtn.addEventListener('click',()=>{
            location.reload();
        })
        //  requestAnimationFrame(animate);
        animation = requestAnimationFrame(animate);
        if(game.soldier.health == 0){
            cancelAnimationFrame(animation);
            ctx.fillStyle='black';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.font = '45px monospace';
            ctx.fillStyle='gold';
            ctx.fillText('!!Game-Over',450,250);
            ctx.font = '25px monospace';
            ctx.fillStyle='yellow';
            ctx.fillText('Your score is '+score ,450,350);
            const button = document.createElement('button');
            button.innerHTML = 'Play-Again';
            button.id = 'Play'
            document.body.appendChild(button);
            button.addEventListener('click',()=>{
                location.reload();
            })
            document.querySelector('.controls').remove();
            document.querySelector('.control-bar').remove();
        }
    }
    animate();
    pauseBtn.addEventListener('click', () => {
        ispaused=!ispaused
        pauseBtn.innerText=ispaused?'RESUME':'PAUSE'
        if(!ispaused){
            animate()        
        }
        else{
        cancelAnimationFrame(animation);}
    })
 
   

   

    function collision (first, second){
        if(!(first.x > second.x + second.width || first.x + first.width < second.x || first.y >second.y + second.height || first.y + first.height < second.y)){
            return true;
        }
    }
    
})

