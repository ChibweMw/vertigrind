import Phaser from  '../lib/phaser.js'

// import Jewel class here
import Jewel from '../game/Jewel.js'
import Spike from '../game/Spike.js'

export default class Game extends Phaser.Scene{

    jewelsCollected = 0
    jumpCount = 0
    /** @type {Phaser.Physics.Arcade.Group} */
    platforms
    platformPool
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors
    /** @type {Phaser.Physics.Arcade.Group} */
    jewels
    /** @type {Phaser.Physics.Arcade.Group} */
    spikes
    spikePool
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

        // load obstacle
        this.load.image('spike', 'assets/sprites/Environment/obstacle_spike.png')

        this.load.audio('jump', 'assets/sfx/jump-4.wav')
        this.load.audio('collect-jewel', 'assets/sfx/collect-1.wav')

        this.load.audio('main-theme', 'assets/music/Pixel-War-1.wav')

        this.load.bitmapFont('babyblocks', 'assets/fonts/babyblocks.png', 'assets/fonts/babyblocks.xml')


        // Input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(){
        let test_spike = this.add.image(340, 320, 'spike')
        test_spike.scale = 3.0
        test_spike.setOrigin(0, 0)

        test_spike.setFlipY(true)
        test_spike.setFlipX(true)

        test_spike.setRotation(Phaser.Math.DegToRad(90))
        
        // start adding colliders to platforms
        this.platforms = this.physics.add.group({
            classType: Phaser.GameObjects.TileSprite,   
            immovable: true,
            allowGravity: false,
            velocityY: -450,
            maxSize: 30,
            removeCallback: function (platform) {
                platform.scene.platformPool.add(platform)
            }
        })

        this.platformPool = this.physics.add.group({
            removeCallback: function (platform) {
                platform.scene.platforms.add(platform)
            }
        })

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
        
        // start adding colliders to spikes

        this.spikes = this.physics.add.group({
            classType: Spike,   
            immovable: true,
            allowGravity: false,
            maxSize: 30,
            velocityY: -450,
            removeCallback: function (spike) {
                spike.scene.spikePool.add(spike)
            }
        })

        this.spikePool = this.physics.add.group({
            removeCallback: function (spike) {
                spike.scene.spikes.add(spike)
            }
        })

        // spike collide with player
        this.physics.add.collider(this.player, this.spikes, this.handlePlayerDeath, undefined, this)

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
        this.timedEvent = this.time.addEvent({ delay: 700, callback: this.spawnPlatform, args: [], callbackScope: this})

        mainTheme.play()
    }

    update(t, dt){

        // HANDLING PLATFORMS
        this.platforms.getChildren().forEach(function(platform){
            // console.log(`PLATFORM NAME : ${platform.name}`)
            
            // Spawn next plaform based on distance from bottom of screen to bottom of platform
            let spawnDistance = this.scale.height - (16 * 3) * Phaser.Math.RND.integerInRange(0, 6)
            // let spawnDistance = this.scale.height - (16 * 3)
            
            let platBottom    = platform.y + platform.displayHeight
            if(platform.name !== 'hasSpawned' && platBottom < spawnDistance){
                // console.log(`Spawn Distance : ${spawnDistance}`)
                platform.name = 'hasSpawned'
                // console.log(`PLATFORM NAME : ${platform.name}`)
                // console.log(`can spawn @ ${platform.y}`) 
                this.spawnPlatform()
            }
            
            // REMOVE PLATFORM
            if(platform.y < -platform.displayHeight){
                platform.name = ''
                this.platforms.killAndHide(platform)
                this.platforms.remove(platform)
            }
        }, this)

        // recycling spike
        this.spikes.getChildren().forEach(function(spike){
            if(spike.y < -spike.displayHeight){
                this.spikes.killAndHide(spike)
                this.spikes.remove(spike)
                console.log(`Removing Platform`)
            }
        }, this)

        // console.log(`Platfrom Group Platforms in use : ${this.platforms.getTotalUsed()}`)
        // console.log(`Platfrom Group Free Platforms : ${this.platforms.getTotalFree()}`)        
        
        // console.log(`Platfrom Pool Platforms in use : ${this.platformPool.getTotalUsed()}`)

        // console.log(`Platfrom Pool First Free Platform : ${this.platformPool.getFirst()}`)

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
                    // this.player.body.gravity.x = -2000
                    this.player.body.gravity.x *= -1
                    this.player.setVelocityX(-800)
                    this.player.setFlipX(false)
                } else {
                    // this.player.body.gravity.x = 2000
                    this.player.body.gravity.x *= -1
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

    handleDamage(player, spike){
        console.log('Player Hit!')
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
        console.log(`Game Over - End Score : ${this.jewelsCollected}`)
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

    // platform spawner. level difficulty
    spawnPlatform(platHeight = Phaser.Math.RND.between(2, 5), spawnLeft = Phaser.Math.RND.pick([true, false])){
        let x
        // Set horizontal spawn position
        if (spawnLeft){
            x = 0
        } else {
            x = this.scale.width - 16 * 3
        }

        const y = this.scale.height

        let sizeHeight = 16 * platHeight
        // let sizeHeight = 16

        let myPlatform

        if(this.platformPool.getLength()){
            // console.log('PLATFORM RECYLED')
            myPlatform = this.platformPool.getFirst()
            // console.log(`MYPLATS : ${myPlatform}`)
            myPlatform.x = x
            myPlatform.y = y
            myPlatform.setActive(true)
            myPlatform.setVisible(true)
            this.platformPool.remove(myPlatform)
        }
        else{
            // console.log('PLATFORM CREATED')
            myPlatform = this.add.tileSprite(x, y, 16, sizeHeight, 'test-platform')
            myPlatform.setOrigin(0, 0)
            this.platforms.add(myPlatform)            
        }
        myPlatform.setSize(myPlatform.width, myPlatform.height)
        myPlatform.setScale(3.0)
        // console.log(`DISPLAYHEIGHT : ${myPlatform.displayHeight}`)

        // is there a spike over the platform?
        if(Phaser.Math.Between(1, 100) <= 50){
            let spike
            let spikeX
            if (x > 0){
                spikeX = (16 * 3)
            } else {
                spikeX = (16 * -3)
            }
            if(this.spikePool.getLength()){
                spike = this.spikePool.getFirst()
                spike.x = x - spikeX 
                spike.y = y + myPlatform.displayHeight / 2
                // spike.alpha = 1
                spike.active = true
                spike.visible = true
                this.spikePool.remove(spike)
            }
            else{
                spike = this.physics.add.sprite(x - spikeX, y + myPlatform.displayHeight / 2 , "spike")
                spike.setImmovable(true)
                // spike.setSize(8, 8, true)
                spike.setDepth(2)
                this.spikes.add(spike)
            }
            spike.setOrigin(0, 0)
            spike.setScale(3.0)

            console.log('SPIKE SPAWNED!')
        }
        
    }
}