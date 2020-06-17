import Phaser from  '../lib/phaser.js'

// import Jewel class here
import Jewel from '../game/Jewel.js'

export default class Game extends Phaser.Scene{

    jewelsCollected = 0
    jumpCount = 0
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms    
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors
    /** @type {Phaser.Physics.Arcade.Group} */
    jewels
    /** @type {Phaser.GameObjects.Text} */
    jewelsCollectedText

    constructor(){
        super('game')
    }

    init(){
        this.jewelsCollected = 0
        this.jumpCount = 0
        this.sound.stopAll()
    }

    preload(){
        this.load.image('test-bg', 'assets/sprites/Background/bg_brick.png')
        
        // load a platform image
        this.load.image('test-platform', 'assets/sprites/Environment/ground_wavy.png')
        
        this.load.image('bunny-stand', 'assets/sprites/Player/bunny_stand.png')
        
        this.load.image('bunny-jump', 'assets/sprites/Player/bunny_jump.png')

        // load jewel image
        this.load.image('jewel', 'assets/sprites/Items/collectible_diamond.png')

        this.load.audio('jump', 'assets/sfx/jump-4.wav')
        this.load.audio('collect-jewel', 'assets/sfx/collect-1.wav')

        this.load.audio('main-theme', 'assets/music/Pixel-War-1.wav')

        // Input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(){
        let bg_brick = this.add.image(340, 320, 'test-bg')
        bg_brick.scale = 3.0
        bg_brick.setScrollFactor(1, 0.5)
        
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
        // this.player.body.checkCollision.up    = false
        this.player.body.checkCollision.left  = false
        this.player.body.checkCollision.right = false

        this.cameras.main.startFollow(this.player)

        // set horizontal dead zones to 1.5 
        // for screenwrapping to work
        this.cameras.main.setDeadzone(this.scale.width * 1.5)
        
        // create a jewel

        this.jewels = this.physics.add.group({
            classType: Jewel
        })

        // Item collide with platform
        this.physics.add.collider(this.platforms, this.jewels)
        // set player item overlap interaction
        this.physics.add.overlap(
            this.player,
            this.jewels,
            this.handleCollectJewel,
            undefined,
            this
        )

        const style = { color: '#fff', fontSize: 24}
        this.jewelsCollectedText = this.add.text(240, 10, 'Jewels: 0', style).setScrollFactor(0).setOrigin(0.5, 0)
        
        // restart scene
        this.input.keyboard.once('keydown_R', () => {
            this.scene.start('game')
        })

        this.sound.play('main-theme')
    }

    update(t, dt){

        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child

            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700){
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()

                // place jewel above reused platform
                this.addJewelAbove(platform)
            }
        })

        const vy = this.player.body.velocity.y
        
        // Use 'SPACE' key to jump
        const isJustDownJump = Phaser.Input.Keyboard.JustDown(this.cursors.space) 
        const isJustUpJump = Phaser.Input.Keyboard.JustUp(this.cursors.space) 

        if (isJustUpJump && vy < 0 ){
            this.player.setVelocityY(0)
        }

        // Check Arcade Physics if player colliding below
        const touchingDown = this.player.body.touching.down
        if (touchingDown){
            this.jumpCount = 0
        }

        let candoubleJump = this.jumpCount < 2
        
        if (isJustDownJump && (touchingDown || candoubleJump)){
            // make bunny jump straight up

            if (this.jumpCount > 0){
                // double jump force
                this.player.setVelocityY(-800)
                // flip gravity
                // this.player.body.gravity.y = -4000
            } else {
                this.player.setVelocityY(-700)
            }

            // switch to jump texture
            this.player.setTexture('bunny-jump')

            // play jump sound
            this.sound.play('jump')
            
            this.jumpCount++
            
            console.log(`1 CAN DOUBLE JUMP ${this.jumpCount}`)
        }

        if (!isJustDownJump && vy > 0 && this.player.texture.key !== 'bunny-stand'){
            // switch back to stand when falling
            this.player.setTexture('bunny-stand')
        }

        // left and right input logic
        if (this.cursors.left.isDown){
            this.player.setVelocityX(-200)
            this.player.setFlipX(true)
        }
        else if (this.cursors.right.isDown){
            this.player.setVelocityX(200)
            this.player.setFlipX(false)
        }
        else {
            // stop left right movement
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)

        const bottomPlatform = this.findBottomMostPlatform()
        if (this.player.y > bottomPlatform.y + 200){
            this.scene.start('game-over')
        }
    }

    /**
     * @param {Phaser.GameObjects.Sprite} sprite
     */
    horizontalWrap(sprite){
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth){
            sprite.x = gameWidth + halfWidth
        }
        else if (sprite.x > gameWidth + halfWidth){
            sprite.x = -halfWidth
        }
    }

    /**
     * 
     * @param {Phaser.GameObjects.Sprite} sprite 
     */
    addJewelAbove(sprite){
        const y = sprite.y - sprite.displayHeight

        /** @type {Phaser.Physics.Arcade.Sprite} */
        const jewel = this.jewels.get(sprite.x, y, 'jewel')

        // this.add.existing(jewel)
        jewel.setActive(true)
        jewel.setVisible(true)

        // update the physics body
        jewel.body.setSize(jewel.width, jewel.height)

        jewel.body.setAllowGravity(false)

        // make sure body is enabled in the physics world
        this.physics.world.enable(jewel)

        return jewel
    }

    /**
     * @param {Phaser.Physics.Arcade.Sprite} player
     * @param {Jewel} jewel
     */
    handleCollectJewel(player, jewel){
        // hide from display
        this.jewels.killAndHide(jewel)

        // disable from physics world
        this.physics.world.disableBody(jewel.body)

        this.jewelsCollected++
        console.log(`Jewels Collected: ${this.jewelsCollected}`)

        // create new text value and set it
        const value = `Jewels: ${this.jewelsCollected}`
        this.jewelsCollectedText.text = value

        // play jewel collect sfx
        this.sound.play('collect-jewel')
    }

    findBottomMostPlatform(){
        const platforms = this.platforms.getChildren()
        let bottomPlatform = platforms[0]

        for (let i = 1; i < platforms.length; ++i){
            const platform = platforms[i]

            // discard any platforms that are above the current
            if (platform.y < bottomPlatform.y){
                continue
            }

            bottomPlatform = platform
        }

        return bottomPlatform
    }
}