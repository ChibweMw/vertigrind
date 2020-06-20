import Phaser from  '../lib/phaser.js'

// import Jewel class here
import Jewel from '../game/Jewel.js'

export default class Game extends Phaser.Scene{

    jewelsCollected = 0
    jumpCount = 0
    /** @type {Phaser.Physics.Arcade.Group} */
    platforms    
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors
    /** @type {Phaser.Physics.Arcade.Group} */
    jewels
    /** @type {Phaser.GameObjects.Text} */
    jewelsCollectedText
    timedEvent
    isGameStart

    constructor(){
        super('game')
    }

    init(){
        this.jewelsCollected = 0
        this.jumpCount = 0
        this.sound.stopAll()
        this.isGameStart = false
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

        this.load.bitmapFont('babyblocks', 'assets/fonts/babyblocks.png', 'assets/fonts/babyblocks.xml')


        // Input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(){
        let bg_brick = this.add.image(340, 320, 'test-bg')
        bg_brick.scale = 3.0
        bg_brick.setScrollFactor(1, 0.5)
        
        // start adding colliders to platforms
        this.platforms = this.physics.add.group({
            immovable: true,
            allowGravity: false,
            velocityY: -450,
            maxSize: 30
        })

        // create 5 platforms for the group
        // for (let i = 0; i < 5; ++i){

        //     const x = Phaser.Math.Between(80, 400)
        //     const y = 150 * i

        //     /** @type {Phaser.Physics.Arcade.Sprite} */
        //     const platform = this.platforms.create(x, y, 'test-platform')
        //     platform.scale = 3.0
            
        //     /** @type {Phaser.Physics.Arcade.StaticBody} */
        //     const body = platform.body
        //     body.updateFromGameObject()
        // }

        // for (let i = 0; i < this.platforms.maxSize; ++i){
        //     const width = this.scale.width
        //     const height = this.scale.height
        //     const x = width
        //     const y = 48 * i

        //     /** @type {Phaser.Physics.Arcade.Sprite} */
        //     const platform = this.platforms.create(x, y, 'test-platform')
        //     platform.scale = 3.0
        // }

        // for (let i = 0; i <  this.platforms.maxSize; ++i){

        //     const x = 0
        //     const y = 48 * i

        //     /** @type {Phaser.Physics.Arcade.Sprite} */
        //     const platform = this.platforms.create(x, y, 'test-platform')
        //     platform.scale = 3.0
        // } 
        

        // this.spawnPlatform()

        // create a bunny sprite
        this.player = this.physics.add.sprite(240, 60, 'bunny-stand').setScale(3.0)

        // this.player.body.gravity.x = -2000
        
        // add collision between player and tiles
        this.physics.add.collider(this.platforms, this.player)

        // specify directional collision checks
        // this.player.body.checkCollision.up    = false
        // this.player.body.checkCollision.left  = false
        // this.player.body.checkCollision.right = false

        // this.cameras.main.startFollow(this.player)

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
        this.jewelsCollectedText = this.add.bitmapText(240, 10, 'babyblocks', 'Jewels: 0', 24).setScrollFactor(0).setOrigin(0.5, 0)
        
        // restart scene
        this.input.keyboard.once('keydown_R', () => {
            this.scene.start('game')
        })

        // PLAY MAIN THEME MUSIC

        const mainTheme = this.sound.add('main-theme', {
            volume: 0.7,
            loop: true
        })

        // this.timedEvent = this.time.delayedCall(1500, this.spawnPlatform(4), [], this)
        this.timedEvent = this.time.addEvent({ delay: 700, callback: this.spawnPlatform, args: [], callbackScope: this, loop: true })

        mainTheme.play()
    }

    update(t, dt){

        // HANDLING PLATFORMS
        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child

            const scrollY = this.scale.height
            if (platform.y <= -platform.height){
                // platform.y = scrollY + platform.height
                this.platforms.killAndHide(platform)
                this.physics.world.disableBody(platform.body)
                platform.setActive(false)
                platform.setVisible(false)
                // if (!platform.active) {
                //     console.log(`platform past top`)
                // }
                // platform.body.updateFromGameObject()

                // place jewel above reused platform
                // this.addJewelAbove(platform)
            }
        })

        // if (this.platforms.getTotalFree() >= this.platforms.maxSize / 2 && this.platforms.getTotalUsed() < this.platforms.maxSize / 2){
        //     // this.spawnPlatform(this.platforms.getTotalFree())
        //     this.spawnPlatform(Phaser.Math.RND.between(3, 9))
        //     console.log('SPAWNING PLATS')
        // }

        console.log(`Platforms in use : ${this.platforms.getTotalUsed()}`)
        console.log(`Free Platforms : ${this.platforms.getTotalFree()}`)


        const vy = this.player.body.velocity.x
        
        // Use 'SPACE' key to jump
        const isJustDownJump = Phaser.Input.Keyboard.JustDown(this.cursors.space) 
        const isJustUpJump = Phaser.Input.Keyboard.JustUp(this.cursors.space) 

        let candoubleJump = this.jumpCount < 2

        if (!this.isGameStart && isJustDownJump){
            this.isGameStart = true
            // console.log(`this.platforms.getFirst.x : ${this.platforms.getFirst.x}`)
            this.player.body.gravity.x = -2000
        }

        if (isJustUpJump && vy !== 0 && candoubleJump){
            this.player.setVelocityX(0)
        }

        // Check Arcade Physics if player colliding below
        const touchingLeft = this.player.body.touching.left
        const touchingRight = this.player.body.touching.right
        if (touchingLeft || touchingRight){
            this.jumpCount = 0

            // ADD TO SCORE WHILE GRINDING ON WALLS
            this.jewelsCollected++
            const value = `Jewels: ${this.jewelsCollected}`
            this.jewelsCollectedText.text = value
        }
        
        if (isJustDownJump && ((touchingLeft || touchingRight) || candoubleJump)){
            // make bunny jump straight up

            if (this.jumpCount > 0){
                // double jump force
                // flip gravity
                if (this.player.body.gravity.x >= 0){
                    this.player.body.gravity.x = -2000
                    this.player.setVelocityX(-800)
                    this.player.setFlipX(false)
                } else {
                    this.player.body.gravity.x = 2000
                    this.player.setVelocityX(800)
                    this.player.setFlipX(true)
                }
            } else {
                if (this.player.body.gravity.x >= 0){
                    this.player.setVelocityX(-800)
                    // console.log('GRAVITY FLIPPED')
                } else {
                    this.player.setVelocityX(800)
                }
                
            }

            // switch to jump texture
            this.player.setTexture('bunny-jump')

            // play jump sound
            this.sound.play('jump')
            
            this.jumpCount++
            
            // console.log(`1 CAN DOUBLE JUMP ${this.jumpCount}`)
        }

        if (!isJustDownJump && (vy < 0 && this.player.body.gravity.x < 0 || vy > 0 && this.player.body.gravity.x > 0 ) && this.player.texture.key !== 'bunny-stand'){
            // switch back to stand when falling
            this.player.setTexture('bunny-stand')
        }

        // this.horizontalWrap(this.player)

        // const bottomPlatform = this.findBottomMostPlatform()
        
        // if (this.player.y > bottomPlatform.y + 200){
        //     this.handlePlayerDeath()
        // }

        this.wordlBoundKill(this.player)

        if (this.player.x > this.scale.width || this.player.x < -this.player.displayWidth){
            this.handlePlayerDeath()
        }
    }

    // /**
    //  * @param {Phaser.GameObjects.Sprite} sprite
    //  */
    // horizontalWrap(sprite){
    //     const halfWidth = sprite.displayWidth * 0.5
    //     const gameWidth = this.scale.width
    //     if (sprite.x < -halfWidth){
    //         sprite.x = gameWidth + halfWidth
    //     }
    //     else if (sprite.x > gameWidth + halfWidth){
    //         sprite.x = -halfWidth
    //     }
    // }

    

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

    handlePlayerDeath(){
        this.scene.start('game-over')
    }

    /**
     * @param {Phaser.GameObjects.Sprite} sprite
     */
    wordlBoundKill(sprite){
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth){
            this.handlePlayerDeath()
        }
        else if (sprite.x > gameWidth + halfWidth){
            this.handlePlayerDeath()
        }
    }

    spawnPlatform(platCount = Phaser.Math.RND.between(this.platforms.maxSize / 10, this.platforms.maxSize / 4), spawnLeft = Phaser.Math.RND.pick([true, false]), x = 0){
        // Set horizontal spawn position
        if (spawnLeft){
            x = 0
        // let x = Phaser.Math.RND.pick([0, this.scale.width])
        } else {
            x = this.scale.width
        }
        // Set platform count
         
        if (this.platforms.getTotalFree() == this.platforms.maxSize && platCount > this.platforms.maxSize){
            platCount = this.platforms.maxSize
            console.log('Reset to maxSize spawn count')
        } else if (platCount > this.platforms.getTotalFree()){
            platCount = this.platforms.getTotalFree()
            console.log('Spawning from remaining')
        }


        for (let i = 0; i < platCount; ++i){
            const y = this.scale.height + (48 * i)

            /** @type {Phaser.Physics.Arcade.Sprite} */
            // const platform = this.platforms.create(x, y, 'test-platform')
            const platform = this.platforms.get(x, y, 'test-platform')
            platform.scale = 3.0

            platform.setActive(true)
            platform.setVisible(true)
            platform.setImmovable(true)
            platform.body.x = x
            platform.body.y = y

            platform.body.setSize(platform.width, platform.height)

            platform.body.setAllowGravity(false)
            this.physics.world.enable(platform)
        }   
    }
}