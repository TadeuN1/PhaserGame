var configuracao = {
    type: Phaser.AUTO,
    width:1890,
    height:840,
    'transparent': true,
    physics:{
        default:'arcade',
        arcade:{
            gravity: {y: 200},
            debug:false
        }
    },
    scene:{
        preload:preload,
        create:create,
        update:update,
    }
}

//
var player;
var plataformas;
var cursores;
var estrelas;

var pontos = 0;
var pontuacao;
var coletadas = 0;
var total;
var enemies = 0;
var inimigos;

var bombas;
var fim = false;

var game = new Phaser.Game(configuracao)
//

function preload(){
    this.load.image('ceu', 'assets/sky2.jpg');
    this.load.image('solo', 'assets/platform.png')
    this.load.image('estrela', 'assets/star.png')
    this.load.image('bomba', 'assets/bomb.png')
    this.load.image('nuvens', 'assets/cloud.png')
    this.load.spritesheet('char', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 })
}
function create(){
    //
    this.add.image(945, 425, 'ceu');
    this.add.image(150, 160, 'nuvens');
    this.add.image(1000, 160, 'nuvens');
    this.add.image(1700, 600, 'nuvens');
    this.add.image(1750, 200, 'nuvens');
    this.add.image(100, 600, 'nuvens');
    //

    //
    plataformas = this.physics.add.staticGroup()
    plataformas.create(945, 890, 'solo').setScale(5).refreshBody()
    plataformas.create(550,300,'solo');
    plataformas.create(1650,300,'solo');
    plataformas.create(1150,500,'solo').setScale(0.5).refreshBody();
    plataformas.create(1400, 700,'solo');
    plataformas.create(200,600,'solo');
    //

    //
    player = this.physics.add.sprite(500, 500, 'char')
    player.setBounce(0.15);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key:'left',
        frames:this.anims.generateFrameNumbers('char', {start: 0, end: 3}),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key:'turn',
        frames: [{ key: 'char', frame:4}],
        frameRate: 15,
    });
    this.anims.create({
        key:'right',
        frames: this.anims.generateFrameNumbers('char', {start: 5, end: 8}),
        frameRate: 15,
        repeat: -1
    });
    
    //

    //
    cursores = this.input.keyboard.createCursorKeys()    
    //

    //
    estrelas = this.physics.add.group({
        key: 'estrela',
        repeat: 19,
        setXY: {x: 15, y:0, stepX: 95}
    })
    estrelas.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.3, 0.5));
    })
    //

    //
    pontuacao = this.add.text(200, 30, 'Pontuação: 0', { fontSize: '42px', fill: 'white'});
    total = this.add.text(1500, 30, '☆: 0', { fontSize: '42px', fill: 'white'});
    inimigos = this.add.text(1700, 29, '💣: 0', { fontSize: '42px', fill: 'white'});

    //

    //
        bombas = this.physics.add.group();
    //

    //
    this.physics.add.collider(player, plataformas);
    this.physics.add.collider(estrelas, plataformas);
    this.physics.add.collider(bombas, plataformas);

    this.physics.add.overlap(player, estrelas, coletaEstrela, null, this);
    this.physics.add.collider(player, bombas, hitBomba, null, this);

    //
}
function update(){
    if(fim){
        return
    }
    //
    if (cursores.left.isDown)
    {
        player.setVelocityX(-150);

        player.anims.play('left', true);
    }
    else if (cursores.right.isDown)
    {
        player.setVelocityX(150);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursores.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-340);
    }
    //
}
function coletaEstrela(player, estrela)
{
    estrela.disableBody(true, true);

    pontos += 10;
    pontuacao.setText('Pontuação: ' + pontos)
    coletadas += 1;
    total.setText('☆: ' + coletadas)
    inimigos.setText('💣: ' + enemies)

    if (estrelas.countActive(true) === 0)
    {
        estrelas.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true)
        });
        enemies += 1;
        var x = (player.x < 945) ? Phaser.Math.Between(900, 850) : Phaser.Math.Between(0, 400);
        var bomba = bombas.create(x, 16, 'bomba');
        bomba.setBounce(1);
        bomba.setCollideWorldBounds(true);
        bomba.setVelocity(Phaser.Math.Between(-250, 250), 25);
        bomba.allowGravity = false
    }

}

function hitBomba (player, bomba)
{
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        fim = true
}

