const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width=innerWidth;
canvas.height=innerHeight;

class Player{
    constructor(){
        this.velocity={
            x:0,
            y:0
        };

        this.rotation = 0;
        
        const image = new Image();
        image.src = './image/spaceship.png';
        image.onload = () =>{
            const scale = .15;
            this.image= image;
            this.width=image.width *scale;
            this.height=image.height *scale;
            this.position={
                x:canvas.width / 2 -this.width /2,
                y:canvas.height - this.height -40,
            };
        };

    };
    draw(){
        // c.fillStyle='red';
        // c.fillRect(this.position.x,this.position.y,this.width,this.height);
        c.save();
        c.translate(player.position.x+player.width/2, player.position.y+player.height/2);
        c.rotate(this.rotation);
        c.translate(-player.position.x-player.width/2, -player.position.y-player.height/2);
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        c.restore();
    };
    
    update(){
        if(this.image){
        this.draw()
        this.position.x += this.velocity.x
        };
    };
};

class Projectile{
    constructor({position,velocity}){
        this.position = position;
        this.velocity =velocity;

        this.radius=3;
    };
    draw(){
        c.beginPath();
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2);
        c.fillStyle='yellow';
        c.fill();
        c.closePath();
    };
    update(){
        this.draw();
        this.position.x+=this.velocity.x;
        this.position.y+=this.velocity.y;
    }
};

class Particle{
    constructor({position,velocity, radius, color, fades}){
        this.position = position;
        this.velocity =velocity;

        this.radius=radius;
        this.color = color;
        this.opacity=1;
        this.fades = fades;
    };
    draw(){
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2);
        c.fillStyle= this.color;
        c.fill();
        c.closePath();
        c.restore();
    };
    update(){
        this.draw();
        this.position.x+=this.velocity.x;
        this.position.y+=this.velocity.y;

        if(this,this.fades) this.opacity -= 0.01;
    }
};

class InvaderProjectile{
    constructor({position,velocity}){
        this.position = position;
        this.velocity =velocity;

        this.width=3;
        this.height =10;
    };
    draw(){
        c.fillStyle='white';
        c.fillRect(this.position.x,this.position.y,this.width,this.height);
    };
    update(){
        this.draw();
        this.position.x+=this.velocity.x;
        this.position.y+=this.velocity.y;
    }
};

class Invader{
    constructor({position}){
        this.velocity={
            x:0,
            y:0
        };

        const image = new Image();
        image.src = './image/invader.png';
        image.onload = () =>{
            const scale = 1;
            this.image= image;
            this.width=image.width *scale;
            this.height=image.height *scale;
            this.position={
                x:position.x,
                y:position.y,
            };
        };

    };
    draw(){
        // c.fillStyle='red';
        // c.fillRect(this.position.x,this.position.y,this.width,this.height);
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    };
    
    update({velocity}){
        if(this.image){
        this.draw()
        this.position.x += velocity.x;
        this.position.y += velocity.y;
        };
    };

    shoot(InvaderProjectiles){
        InvaderProjectiles.push(new InvaderProjectile({
            position:{
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height,
            },
            velocity:{
                x:0,
                y:5,
            },
        }));
    };
};

class Grid {
    constructor(){
        this.position ={
            x:0,
            y:0,
        };
        this.velocity ={
            x:4,
            y:0,
        };
        this.invaders =[];

        const rows = Math.floor(Math.random()*5+2);
        const columns = Math.floor(Math.random()*10+4);

        this.width = columns*30;

        for(let x=0;x<columns;x++){
            for(let y=0;y<rows;y++){
                this.invaders.push(
                    new Invader({
                        position:{
                            x:x*30,
                            y:y*30,
                        } 
                    })
                );
            };
        };
        console.log(this,this.invaders);
    };
    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width || this.position.x <=0){
            this.velocity.x = -this.velocity.x;
            this.velocity.y =20;
        };
    };
};

const player =new Player();
const projectiles =[];
const grids = [];
const InvaderProjectiles = [];
const particles = [];
const keys ={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    space:{
        pressed:false
    },
};

for(let i=0;i<100;i++){
    particles.push(new Particle({
        position:{
            x:Math.random() * canvas.width,
            y:Math.random() * canvas.height,
        },
        velocity:{
            x:0,
            y:1,
        },
        radius:Math.random()*3,
        color:'white',
    }));
};

let frames = 0;
let randomInterval = Math.floor((Math.random()*500)+500);

function createParticles({object, color, fades}){
    for(let i=0;i<15;i++){
        particles.push(new Particle({
            position:{
                x:object.position.x + object.width / 2,
                y:object.position.y + object.height / 2,
            },
            velocity:{
                x:(Math.random() - 0.5)*2,
                y:(Math.random() - 0.5)*2,
            },
            radius:Math.random()*3,
            color: color||'red',
            fades
        }));
    };
};

function animate(){
    requestAnimationFrame(animate);
    c.fillStyle='black';
    c.fillRect(0,0, canvas.width,canvas.height);
    player.update();
    particles.forEach((particle,i) =>{

        if(particle.position.y - particle.radius >= canvas.height){
            particle.position.x = Math.random() * canvas.width;
            particle.position.y = -particle.radius;
        };
        if(particle.opacity <= 0){
            setTimeout(() => {
                particles.splice(i,1);
            },0);
        }else{
            particle.update()
        };
    });
    InvaderProjectiles.forEach((InvaderProjectile,index) => {
        if(InvaderProjectile.position.y + InvaderProjectile.height >= canvas.height){
            setTimeout(()=>{
                InvaderProjectiles.splice(index,1);
            },0);
        }else{
            InvaderProjectile.update()
        };
        //projectile hits player
        if (InvaderProjectile.position.y + InvaderProjectile.height >= player.position.y
            && InvaderProjectile.position.x + InvaderProjectile.width >= player.position.x
            && InvaderProjectile.position.x <= player.position.x + player.width){
                setTimeout(()=>{
                    InvaderProjectiles.splice(index,1);
                },0);
                console.log('you loose');
                createParticles({
                    object: player,
                    color: 'white',
                    fades: true,
                });
        };
    });
    //console.log(InvaderProjectiles);
    projectiles.forEach((Projectile, index) => {

        if(Projectile.position.y+Projectile.radius<=0){
            setTimeout(()=>{
                projectiles.splice(index,1);
            },0);
        }else{
            Projectile.update();
        };
    });

    grids.forEach((grid, gridIndex) => { 
        grid.update();

        //spawn projectiles
        if(frames % 100 === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random()* grid.invaders.length)].shoot(InvaderProjectiles);
        };

        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity});

            //projectiles hit enemy
            projectiles.forEach((projectile,j) =>{
                if(projectile.position.y - projectile.radius <= invader.position.y
                    + invader.height && projectile.position.x + projectile.radius >=
                    invader.position.x && projectile.position.x - projectile.radius <=
                    invader.position.x + invader.width && projectile.position.y + projectile.radius >=
                    invader.position.y){
                
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(invader2 => {
                            return invader2 === invader;
                        });
                        const projectileFound = projectiles.find(
                            projectile2 => projectile2 === projectile
                        );
                        
                        //remove invader and projectile
                        if (invaderFound && projectileFound){
                            createParticles({
                                object: invader,
                                fades: true,
                            });

                            grid.invaders.splice(i,1);
                            projectiles.splice(j,1);

                            if(grid.invaders.length > 0){
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];

                                grid.width = lastInvader.position.x - firstInvader.position.x +
                                lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                            }else{
                                grids.splice(gridIndex,1);
                            };
                        };
                    },0);
                } 
            });
        });
    });

    if(keys.a.pressed && player.position.x >=0){
        player.velocity.x = -8;
        player.rotation = -0.15;
    }else if(keys.d.pressed &&player.position.x + player.width <=canvas.width){
        player.velocity.x = 6;
        player.rotation = 1;
    } else{
        player.velocity.x = 0;
        player.rotation = 0;
    };

    //spawning enemies
    if (frames % randomInterval === 0){
        grids.push(new Grid());
        randomInterval = Math.floor((Math.random()*500)+500);
        frames=0;
    };
    frames++;
};
animate();

addEventListener('keydown', ({key})=>{
    switch(key){
        case 'a':
            // console.log('left');
            keys.a.pressed = true;
        break;
        case 'd':
            // console.log('right');
            keys.d.pressed = true;
        break;
        case ' ':
            // console.log('space');
            projectiles.push(new Projectile({
                position:{
                    x:player.position.x+player.width/2,
                    y:player.position.y
                },
                velocity:{
                    x:0,
                    y:-5
                },
            }));
            // console.log(projectiles);
        break;
        default:
            console.log('invalid argument');
    };
});

addEventListener('keyup', ({key})=>{
    switch(key){
        case 'a':
            // console.log('left');
            keys.a.pressed = false;
        break;
        case 'd':
            // console.log('right');
            keys.d.pressed = false;
        break;
        case ' ':
            // console.log('space');
        break;
        default:
            console.log('invalid argument');
    };
});