import Phaser from  '../lib/phaser.js'

export default class Game extends Phaser.Scene{

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms    
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    constructor(){
        super('game')
    }

    preload(){
        this.load.image('test-bg', 'assets/sprites/Background/bg_brick.png')
        
        // load a platform image
        this.load.image('test-platform', 'assets/sprites/Environment/ground_wavy.png')
        
        this.load.image('bunny-stand', 'assets/sprites/Player/bunny_stand.png')
        
        // Input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(){
        let bg_brick = this.add.image(340, 320, 'test-bg')
        bg_brick.scale = 3.0
        bg_brick.setScrollFactor(1, 0)
        
        // start adding colliders to platforms
        this.platforms = this.physics.add.staticGroup()

        // create 5 platforms for the group
        for (let i = 0; i < 5; ++i){

            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'test-platform')
            platform.scale = 3.0
            
            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()
        }

        // create a bunny sprite
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(3.0)
        
        // add collision between player and tiles
        this.physics.add.collider(this.platforms, this.player)

        // specify directional collision checks
        this.player.body.checkCollision.up    = false
        this.player.body.checkCollision.left  = false
        this.player.body.checkCollision.right = false

        this.cameras.main.startFollow(this.player)
    }

    update(t, dt){

        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child

            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700){
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
            }
        })

        // Check Arcade Physics if player colliding below
        const touchingDown = this.player.body.touching.down

        if (touchingDown){
            // make bunny jump straight up
            this.player.setVelocityY(-300)
        }

        // left and right input logic
        if (this.cursors.left.isDown && !touchingDown){
            this.player.setVelocityX(-200)
        }
        else if (this.cursors.right.isDown && !touchingDown){
            this.player.setVelocityX(200)
        }
        else {
            // stop left right movement
            this.player.setVelocityX(0)
        }
    }
}