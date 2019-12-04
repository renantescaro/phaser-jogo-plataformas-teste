var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 450 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var teclaEsc;

var game;
var map;
var player;
var stars;
var platforms;
var chao;
var cursors;
var score = 0;
var scoreText;

function iniciarJogo(){

    document.getElementById('dvMenu').style.display = 'none';

    game = new Phaser.Game(config);
}

function sairJogo(){

    window.location.href = '';
}

function configuracoes(){
    
    let canvas = document.getElementsByTagName('canvas')[0];

    if(canvas.style.display == ''){

        document.getElementById('dvMenu').style.display = 'none';

        document.getElementById('dvMenuConfiguracoes').style.display = '';

        canvas.style.display = 'none';
    
    }else{

        document.getElementById('dvMenuConfiguracoes').style.display = 'none';
        
        canvas.style.display = '';
    }
}

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('groundPequeno', 'assets/platformPequenaa.png');
    this.load.image('chao', 'assets/chao.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    // *** Cenário ***
    
    // background
    this.add.image(400, 300, 'sky');
    this.add.image(1200, 300, 'sky');
    this.add.image(2000, 300, 'sky');
    this.add.image(2800, 300, 'sky');
    this.add.image(3600, 300, 'sky');
    
    platforms = this.physics.add.staticGroup();
    chao = this.physics.add.staticGroup();
    
    // chão
    platforms.create(400, 568, 'chao').setScale(2).refreshBody();
    platforms.create(1100, 568, 'chao').setScale(2).refreshBody();
    platforms.create(2500, 568, 'chao').setScale(2).refreshBody();
    platforms.create(3500, 568, 'chao').setScale(2).refreshBody();
    
    // plataformas
    platforms.create(600, 450, 'ground');
    platforms.create(1000, 350, 'ground');
    platforms.create(1400, 250, 'ground');
    platforms.create(2050, 350, 'ground');

    platforms.create(2450, 350, 'groundPequeno');
    platforms.create(2650, 350, 'groundPequeno');
    platforms.create(2850, 350, 'groundPequeno');
    platforms.create(3050, 350, 'groundPequeno');
    platforms.create(3250, 400, 'groundPequeno');

    
    // Player
    player = this.physics.add.sprite(100, 450, 'dude');
    
    // camera
    this.cameras.main.setBounds(0,0,1920*2, 700);
    this.physics.world.setBounds(0,0,1920*2,700);
    this.cameras.main.startFollow(player, true, 0.05, 0.05);
    
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    this.physics.add.collider(player, platforms);

    // Animações
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    teclaEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    cursors = this.input.keyboard.createCursorKeys();
    
    
    // Estrelas
    
    // grupo de 30 estrelas, a cada 205 px, a partir de 1000 px do inicio de x
    stars = this.physics.add.group({
        key: 'star',
        repeat: 30,
        setXY: { x: 1000, y: 0, stepX: 205 }
    });
    
    /*
    // loop entre o grupo de estrelas
    stars.children.iterate(function (child) {
        
        // seta a quicada da estrela entre 0.4 e 0.8
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    */

   scoreText = this.add.text(100, 100, 'score: 0', { fontSize: '32px', fill: '#000' });
   

   //scoreText.startFollow(player, true, 0.05, 0.05);

   // adiciona colisão entre as estrelas e as plataformas
   this.physics.add.collider(stars, platforms);
   
   // quando player sobrepor uma estrela, chama o metodo collectStar
   this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update ()
{

    scoreText.x = player.x;

    
    if(player.y > 650){

        alert('morreu!');

        window.location.href = "localhost";
    }

    if(Phaser.Input.Keyboard.JustDown(teclaEsc)){

        configuracoes();
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

// desativa estrela sobreposta pelo player
function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);
}