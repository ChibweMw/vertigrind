import Phaser from  '../lib/phaser.js'
// import SceneTransition from './Transitions.js'


// import Jewel class here
import Jewel from '../game/Jewel.js'
import Spike from '../game/Spike.js'
import Player from '../game/Player.js'
import Platform from '../game/Platform.js'
import GameOptions from '../GameOptions.js'

export default class Game extends Phaser.Scene{
// export default class Game extends SceneTransition{

    score = 0
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
    scoreText
    timedEvent
    isGameStart
    pauseButton
    debugButton
    // /** @type {Phaser.GameObjects.Particles} */
    particlesGrind

    constructor(){
        super('game')
    }

    init(){
        this.score = 0
        this.jumpCount = 0
        this.sound.stopAll()
        this.isGameStart = false
    }

    preload(){
        this.load.image('test-bg', 'assets/sprites/Background/bg_brick.png')
        
        // load a platform image
        this.load.image('test-platform', 'assets/sprites/Environment/ground_wavy.png')
        
        this.load.image('bunny-stand', 'assets/sprites/Player/yogi-test.png')
        
        this.load.image('bunny-jump', 'assets/sprites/Player/bunny_jump.png')
        
        // yogi assets
        this.load.spritesheet('yogi-idle', 'assets/sprites/Player/anim_idle.png', { frameWidth: 14, frameHeight: 18, startFrame: 0, endFrame: 2 })
        this.load.spritesheet('yogi-jump', 'assets/sprites/Player/anim_jump.png', { frameWidth: 10, frameHeight: 10, startFrame: 0, endFrame: 3 })
        
        // load jewel image
        this.load.image('jewel', 'assets/sprites/Items/collectible_diamond.png')

        // load obstacle
        this.load.image('spike', 'assets/sprites/Environment/obstacle_spike.png')
        
        // load particles
        this.load.image('particle-Grind-1', 'assets/sprites/Player/particle_grind-1.png')
        this.load.image('particle-Grind-2', 'assets/sprites/Player/particle_grind-2.png')
        this.load.image('particle-Grind-3', 'assets/sprites/Player/particle_grind-3.png')

        this.load.audio('jump', 'assets/sfx/jump-4.wav')
        this.load.audio('collect-jewel', 'assets/sfx/collect-1.wav')

        this.load.audio('main-theme', 'assets/music/Pixel-War-1.wav')

        this.load.bitmapFont('babyblocks', 'assets/fonts/babyblocks.png', 'assets/fonts/babyblocks.xml')


        // Input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(){
        // super.create()

        
        
        // console.log(`Screen height : ${this.scale.height}`)            

        // start adding colliders to platforms
        this.platforms = this.physics.add.group({
            classType: Platform,   
            immovable: true,
            allowGravity: false,
            velocityY: (GameOptions.platformStartSpeed * -1),
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

        // create animations for player
        const config_idle = {
            key: 'yogiIdle',
            frames: this.anims.generateFrameNumbers('yogi-idle', { start: 0, end: 2, first: 0 }),
            frameRate: 8,
            repeat: -1
        }

        const config_jump = {
            key: 'yogiJump',
            frames: this.anims.generateFrameNumbers('yogi-jump', { start: 0, end: 3, first: 0 }),
            frameRate: 18,
            repeat: -1
        }

        this.anims.create(config_idle)
        this.anims.create(config_jump)

        this.particlesGrind = this.add.particles('particle-Grind-1')

        // create a bunny sprite
        // this.player = this.physics.add.sprite(240, 60, 'bunny-stand').setScale(3.0)
        // this.player = this.physics.add.sprite(240, 60, 'yogi-idle').play('yogiIdle').setScale(3.0)
        this.player = this.physics.add.sprite(240, 60, 'yogi-idle').play('yogiIdle').setScale(3.0)
        // this.player = this.physics.add.sprite(240, 60, 'yogi-idle').setScale(3.0)
        
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
        this.scoreText = this.add.bitmapText(240, 10, 'babyblocks', 'Jewels : 0', 24).setScrollFactor(0).setOrigin(0.5, 0)
        
        // start adding colliders to spikes

        this.spikes = this.physics.add.group({
            classType: Spike,   
            allowGravity: false,
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
            this.scene.restart('game')
        })

        this.pauseButton = this.input.keyboard.addKey('P')
        // this.debugButton = this.input.keyboard.addKey('A')

        // PLAY MAIN THEME MUSIC

        const mainTheme = this.sound.add('main-theme', {
            volume: 0.7,
            loop: true
        })

        // this.timedEvent = this.time.delayedCall(1500, this.spawnPlatform(4), [], this)
        this.timedEvent = this.time.addEvent({ delay: 700, callback: this.spawnPlatform, args: [], callbackScope: this})

        if (this.isGameStart){

            const touchingLeft = this.player.body.touching.left
            const touchingRight = this.player.body.touching.right

            if ( (touchingLeft || touchingRight) && this.player.body.velocity.x){
                this.player.anims.stop('yogiJump')
                this.player.play('yogiIdle')

                console.log('LANDED LANDED LANDED')
                
            } else if ( (!touchingLeft || !touchingRight) && this.player.body.velocity.x){
                this.player.anims.stop('yogiIdle')
                this.player.play('yogiJump')
                
            }
        }

        mainTheme.play()
        
    }

    update(t, dt){


        // toggle debug view
        // const isDebugDown = Phaser.Input.Keyboard.JustDown(this.debugButton)
        // if (isDebugDown){
        //     GameOptions.isDebug = !GameOptions.isDebug
        //     console.log(GameOptions.isDebug)
        // }

        const isPauseDown = Phaser.Input.Keyboard.JustDown(this.pauseButton) 
        
        if (isPauseDown && !this.scene.isPaused()){
            // console.log('PAUSE')
            this.scene.pause('game')
            this.scene.launch('pause', {score : this.score})
        } 
        // HANDLING PLATFORMS
        /** @type {Platform} */
        this.platforms.getChildren().forEach(function(platform){
            // console.log(`PLATFORM NAME : ${platform.name}`)
            
            // platform.update()
            // scroll texture vertically
            // platform.tilePositionY++
            
            // if (this.score > 50 && this.score < 100){
            //     console.log(`platform velocity ${platform.body.velocity.y}`)
            // }
            
            // Spawn next plaform based on distance from bottom of screen to bottom of platform
            let spawnDistance
            let platBottom    = platform.y + platform.displayHeight
            if (this.isGameStart){
                spawnDistance = this.scale.height - (16 * 3) * Phaser.Math.RND.integerInRange(GameOptions.platformSizeRange[0], GameOptions.platformSizeRange[1])
            } else {
                spawnDistance = this.scale.height - (16 * 3) * 0 //- platform.displayHeight
            }
            // let spawnDistance = this.scale.height - (16 * 3)
            
            if(platform.name !== 'hasSpawned' && platBottom <= spawnDistance){
                this.spawnPlatform()
                platform.name = 'hasSpawned'
                // console.log(`Spawn Distance : ${spawnDistance}`)
                // console.log(`PLATFORM NAME : ${platform.name}`)
                // console.log(`can spawn @ ${platform.y}`) 
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
            
            spike.update()

            if(spike.y < -spike.displayHeight){
                this.spikes.killAndHide(spike)
                this.spikes.remove(spike)
                // console.log(`Removing spike`)
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

        let candoubleJump = this.jumpCount < GameOptions.playerJumpCount

        if (!this.isGameStart && isJustDownJump){
            // this.isGameStart = true
            // console.log(`this.platforms.getFirst.x : ${this.platforms.getFirst.x}`)
            this.player.body.gravity.x = GameOptions.playerGravity * -1
            }

        if (isJustUpJump && vy !== 0 && candoubleJump){
            this.player.setVelocityX(0)
        }

        // Check Arcade Physics if player colliding below
        const touchingLeft = this.player.body.touching.left
        const touchingRight = this.player.body.touching.right
        if (touchingLeft || touchingRight){
            if (!this.isGameStart){
                this.isGameStart = true
            }
            this.jumpCount = 0

            // this.player.anims.stop('yogiJump')
            // this.player.play('yogiIdle')

            // Particle emmiter for wall sliding
            // let grindPositionX
            // let grindPositionY = this.player.y + this.player.displayHeight / 2 - 10
            // let velocityX
            // let startAngle
            // if (touchingRight){
            //     grindPositionX = this.player.x + this.player.width / 2
            //     velocityX = {min : 80, max : 100}
            // } else {
            //     grindPositionX = this.player.x - this.player.width / 2
            //     velocityX = {min : -80, max : -100}
            // }

            // const emitterGrind = this.particlesGrind.createEmitter({
            //     scale: 3,
            //     speedX: velocityX,
            //     speedY: {
            //         min: -350,
            //         max: -550
            //     },
            //     maxParticles: 1
            // })

            // this.particlesGrind.setDepth(3)
            
            // emitterGrind.emitParticleAt(grindPositionX, grindPositionY)

            // ADD TO SCORE WHILE GRINDING ON WALLS
            this.score++
            const value = `Jewels: ${this.score}`
            this.scoreText.text = value
        }
        
        if (isJustDownJump && ((touchingLeft || touchingRight) || candoubleJump)){
            // make bunny jump straight up

            if (this.jumpCount > 0){
                // double jump force
                // flip gravity
                if (this.player.body.gravity.x >= 0){
                    // this.player.body.gravity.x = -2000
                    this.player.body.gravity.x *= -1
                    this.player.setVelocityX(-GameOptions.playerJumpForce)
                    this.player.setFlipX(false)
                } else {
                    // this.player.body.gravity.x = 2000
                    this.player.body.gravity.x *= -1
                    this.player.setVelocityX(GameOptions.playerJumpForce)
                    this.player.setFlipX(true)
                }
            } else {
                if (this.player.body.gravity.x >= 0){
                    this.player.setVelocityX(-GameOptions.playerJumpForce)
                    // console.log('GRAVITY FLIPPED')
                } else {
                    this.player.setVelocityX(GameOptions.playerJumpForce)
                }
                
            }

            // switch to jump texture
            // this.player.setTexture('bunny-jump')

            // play jump sound
            this.sound.play('jump')
            
            this.jumpCount++
            
            // console.log(`1 CAN DOUBLE JUMP ${this.jumpCount}`)
        }

        // if (!isJustDownJump && (vy < 0 && this.player.body.gravity.x < 0 || vy > 0 && this.player.body.gravity.x > 0 ) && this.player.texture.key !== 'bunny-stand'){
        //     // switch back to stand when falling
        //     this.player.setTexture('bunny-stand')
        // }

        if (this.isGameStart) {
            this.wordlBoundKill(this.player)
        }


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

        this.score++
        console.log(`Jewels Collected: ${this.score}`)

        // create new text value and set it
        const value = `Jewels: ${this.score}`
        this.scoreText.text = value

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
        console.log(`Game Over - End Score : ${this.score}`)
        if (this.scene.isActive('pause')){
            this.scene.stop('pause')
        }
        this.scene.start('game-over', {score : this.score})
        this.isGameStart = false
        // this.scene.transition({
        //     duration: 1000,
        //     target: 'game-over',
        //     data: {score : this.score}
        // })
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
    spawnPlatform(tileCount = Phaser.Math.RND.integerInRange(GameOptions.platformSizeRange[0], GameOptions.platformSizeRange[1]), spawnLeft = Phaser.Math.RND.pick([true, false])){
        let x
        let tileSize = (16 * 3)
        // Set horizontal spawn position
        if (spawnLeft){
            x = 0
        } else {
            if (this.isGameStart && this.score > GameOptions.levelDifficulty[0]){
                x = this.scale.width - tileSize
            } else {
                x = 0
            }
        }

        let y = this.scale.height

        let platformHeight = 16 * tileCount
        // let platformHeight = 16

        /** @type {Phaser.GameObjects.TileSprite} */
        let myPlatform

        if(this.platformPool.getLength()){
            myPlatform = this.platformPool.getFirst()
            myPlatform.x = x
            myPlatform.y = y
            myPlatform.setActive(true)
            myPlatform.setVisible(true)

            this.platformPool.remove(myPlatform)
        }
        else{
            // myPlatform = this.add.tileSprite(x, y, 16, platformHeight, 'test-platform')
            // myPlatform.setOrigin(0, 0)   
            
            myPlatform = this.platforms.get(x, y)
            myPlatform.setTexture('test-platform')

            // this.add.existing(spike)
            myPlatform.setActive(true)
            myPlatform.setVisible(true)

            myPlatform.body.setAllowGravity(false)
            // make sure body is enabled in the physics world
            this.physics.world.enable(myPlatform)
            this.platforms.add(myPlatform)            
        }
        
        myPlatform.width = 16
        myPlatform.height = platformHeight
        myPlatform.body.setSize(myPlatform.width, platformHeight)
        
        myPlatform.setScale(3.0)

        if (this.score > GameOptions.levelDifficulty[1]) {
            // console.log(`passed 100 points. Release the Spikes!`)

            // is there a spike over the platform?
            if(Phaser.Math.Between(1, 100) <= 60 && tileCount > 3){
                // console.log(`========================`)
                
                /** @type {Phaser.Physics.Arcade.Sprite} */
                let spike
                let spikeX
                let spikeTileCount = tileCount - 1
                let currentPlacement = Math.floor(Phaser.Math.RND.integerInRange(0, spikeTileCount))
                let spikePlacementY = tileSize * currentPlacement         
                
                let spikePosY = y + spikePlacementY
                
                let spikeHitBoxOffsetx
                
                if (spawnLeft){
                    spikeX = x + tileSize
                    spikeHitBoxOffsetx = 0
                } else {
                    spikeX = x - tileSize
                    spikeHitBoxOffsetx = 12
                }
                
                if(this.spikePool.getLength()){
                    spike = this.spikePool.getFirst()
                    spike.x = spikeX 
                    spike.y = spikePosY
                    spike.active = true
                    spike.visible = true
                    spike.body.setOffset(spikeHitBoxOffsetx, spike.height / 2)
                    this.spikePool.remove(spike)
                }
                else{
                    // spike = this.physics.add.sprite(tileSize, spikePosY, "spike")
                    spike = this.spikes.get(spikeX, spikePosY, "spike")

                    // this.add.existing(spike)
                    spike.setActive(true)
                    spike.setVisible(true)

                    // update the physics body
                    // spike.body.setSize(spike.width, spike.height)
                    spike.body.setSize(4, 8, true) // 'true' is set to center hitbox
                    spike.body.setOffset(spikeHitBoxOffsetx, spike.height / 2)

                    spike.body.setAllowGravity(false)

                    // make sure body is enabled in the physics world
                    this.physics.world.enable(spike)
                    this.spikes.add(spike)
                }
                spike.setVelocityY(myPlatform.body.velocity.y)

                if (spawnLeft){
                    spike.setFlipX(false)
                } else {
                    spike.setFlipX(true)
                }
            }            
        }
    }
}