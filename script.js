var config = {
    type: Phaser.AUTO,
    width: window.innerWidth-10,
    height: window.innerHeight-20,
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

var teclaEsc
var teclaPulo
var game
var map
var player
var stars
var corote
var biblias
var platforms
var chao
var cursors
var score = 0
var vida = 100
var scoreText
var nPulos = 0
var btnAndarEsquerda
var btnAndarDireita

function preload ()
{
    this.load.image('btn', 'assets/btn.png');

    this.load.image('sky', 'assets/sky.png');
    this.load.image('biblia', 'assets/biblia.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('groundPequeno', 'assets/platformPequenaa.png');
    this.load.image('chao', 'assets/chao.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('corote', 'assets/corote.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 49, frameHeight: 137 });
}

function create ()
{
    // *** Cenário ***
    
    // background
    this.add.image(400,  330, 'sky');
    this.add.image(1600, 330, 'sky');
    this.add.image(2800, 330, 'sky');
    this.add.image(4000, 330, 'sky');
    this.add.image(5200, 330, 'sky');

    platforms = this.physics.add.staticGroup();
    chao = this.physics.add.staticGroup();
    
    // chão
    platforms.create(400,  670, 'chao').setScale(2).refreshBody()
    platforms.create(1100, 670, 'chao').setScale(2).refreshBody()
    platforms.create(2500, 670, 'chao').setScale(2).refreshBody()
    platforms.create(3500, 670, 'chao').setScale(2).refreshBody()
    
    // plataformas
    platforms.create(600,  545, 'ground')
    platforms.create(1000, 360, 'ground')
    platforms.create(1400, 300, 'ground')
    platforms.create(2050, 400, 'ground')
    platforms.create(2450, 400, 'groundPequeno')
    platforms.create(2650, 400, 'groundPequeno')
    platforms.create(2850, 400, 'groundPequeno')
    platforms.create(3050, 450, 'groundPequeno')
    platforms.create(3180, 230, 'groundPequeno')
    platforms.create(3580, 230, 'groundPequeno')
    
    corote = this.physics.add.sprite(3580, 170,'corote')
    player = this.physics.add.sprite(100, 450, 'dude')
    
    btnAndarEsquerda = this.add.sprite(70, 650, 'btn').setInteractive()
    btnAndarDireita = this.add.sprite(170, 650, 'btn').setInteractive()

    // se for celular
    if('ontouchstart' in window){

        btnAndarEsquerda.on('pointerdown', andarEsquerda)
        btnAndarEsquerda.on('pointerup', parar)
        btnAndarDireita.on('pointerdown', andarDireita)
        btnAndarDireita.on('pointerup', parar)
    }

    // camera
    this.cameras.main.setBounds(0,0,1920*2, 700)
    this.physics.world.setBounds(0,0,1920*2,700)
    this.cameras.main.startFollow(player, true, 0.05, 0.05)
    
    player.setBounce(0)
    player.setCollideWorldBounds(true)
    
    this.physics.add.collider(player, platforms)

    // Animações
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: -1, end: 3 }),
        frameRate: 10,
        repeat: -1
    })
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    })

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    teclaEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    teclaPulo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    cursors = this.input.keyboard.createCursorKeys();
    
    
    // Estrelas
    
    // grupo de 30 estrelas, a cada 205 px, a partir de 1000 px do inicio de x
    stars = this.physics.add.group({
        key: 'star',
        repeat: 30,
        setXY: { x: 1000, y: 0, stepX: 205 }
    });
    
    biblias = this.physics.add.group();

   scoreText = this.add.text(100, 100, 'Pontos: 0  Vida: 100', { fontSize: '32px', fill: '#000' });

   // adiciona colisão entre as estrelas e as plataformas
   this.physics.add.collider(stars, platforms);
   this.physics.add.collider(biblias, platforms);
   this.physics.add.collider(corote, platforms);
   
   // quando player sobrepor uma estrela, chama o metodo collectStar
   this.physics.add.overlap(player, stars, collectStar, null, this);
   this.physics.add.overlap(player, biblias, encostarBiblia, null, this)
   this.physics.add.overlap(player, corote, fimFase, null, this);
}

function update (){

    if(player.body.touching.down){ 

        nPulos = 0;
    }

    scoreText.x = player.x;
    
    if(player.y > 630){

        morrer();
    }

    if(Phaser.Input.Keyboard.JustDown(teclaEsc)){

        configuracoes();
    }

    if (cursors.left.isDown){

        andarEsquerda()

    }else if (cursors.right.isDown){

        andarDireita()
    }else{

        parar()
    }
    
    if(Phaser.Input.Keyboard.JustDown(teclaPulo)){

        if(nPulos == 0 && player.body.touching.down){
    
            pular()
        }
        
        if(nPulos == 1 && !player.body.touching.down){

            pular()
        }
    }
}

function andarEsquerda(){

    player.setVelocityX(-160)
    player.anims.play('left', true)
}

function andarDireita(){

    player.setVelocityX(160)
    player.anims.play('right', true)
}

function parar(){

    player.setVelocityX(0)
	player.anims.play('turn')
}

function pular(){

    nPulos++
    player.setVelocityY(-330)
}

// desativa estrela sobreposta pelo player
function collectStar (player, star){

    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Pontos: ' + score + ' Vida: ' + vida);

    var biblia = biblias.create(1, 1, 'biblia');
    biblia.setBounce(1);
    biblia.setCollideWorldBounds(true);
    biblia.setVelocity(Phaser.Math.Between(-50, 500), 20);
}

function encostarBiblia(player, biblia){

    vida -= 1;
    scoreText.setText('Pontos: ' + score + ' Vida: ' + vida);

    if(vida <= 0){

        morrer();
    }
}

function fimFase(player, corote){
    
    document.body.style.backgroundColor = '#090';

    document.getElementsByTagName('canvas')[0].style.display = 'none';

    document.getElementById('dvFimFase').style.display = '';
}

// ***************************************************

function iniciarJogo(){

    document.getElementById('dvMenu').style.display = 'none';

    document.body.style.backgroundColor = '#000';

    game = new Phaser.Game(config);
}

function sairJogo(){

    window.location.href = '';
}

function reiniciar(){

    window.location.href = '';
}

function morrer(){

    document.body.style.backgroundColor = '#900';

    document.getElementsByTagName('canvas')[0].style.display = 'none';
    document.getElementById('morte').style.display = '';
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