import Phaser from  '../lib/phaser.js'
// import SceneTransition from './Transitions.js'


// import Jewel class here
import Jewel from '../game/Jewel.js'
import Spike from '../game/Spike.js'
import Player from '../game/Player.js'
import PlayerInputState from '../game/states/PlayerInputState.js'
import Platform from '../game/Platform.js'
import GameOptions from '../GameOptions.js'

import PlayerShadow from '../game/shadowParticle.js'

export default class Game extends Phaser.Scene{
// export default class Game extends SceneTransition{

    score = 0
    jumpCount = 0
    /** @type {Phaser.Physics.Arcade.Group} */
    platforms
    platformPool

    // /** @type {Phaser.Physics.Arcade.Sprite} */
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
    boulderParticle

    emit_boulders

    /** @type {Phaser.GameObjects.TileSprite} */
    bg_clouds_a
    bg_clouds_b
    bg_clouds_c
    bg_clouds_d
    bg_clouds_e
    bg_clouds_f
    bg_clouds_a_dupe
    bg_clouds_b_dupe

    /** @type {Phaser.GameObjects.Particles.Particle} */
    shadowFX

    flippingGrav = false

    // cursors

    constructor(){
        super('game')
    }

    init(){
        this.score = 0
        this.jumpCount = 0
        this.sound.stopAll()
        GameOptions.isGameStart = false
        GameOptions.currentGameScore = 0
        GameOptions.platformSpeedLevel[1] = GameOptions.platformStartSpeed
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload(){
        // Input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(){

        // super.create()

        // Add BG Layers

        // Clouds A-00
        this.bg_clouds_a = this.add.tileSprite(0, 0, 48 * 2, this.scale.height, 'bg-clouds_b')
        // this.bg_clouds_a.toggleFlipY()

        this.bg_clouds_a.setOrigin(0, 0)
        this.bg_clouds_a.setTileScale(3, 3)
        this.bg_clouds_a.setDepth(-5)
        // this.bg_clouds_a.setTintFill(0x30303d) //ea6e48
        this.bg_clouds_a.setTintFill(0x5564a0)

        this.bg_clouds_a.tilePositionY = 12

        this.tweens.add({
            targets: this.bg_clouds_a,
            x: 12,
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        })

        // Clouds A-01
        this.bg_clouds_a_dupe = this.add.tileSprite(48 / 4, 0, 48 * 2, this.scale.height, 'bg-clouds_b')
        this.bg_clouds_a_dupe.setOrigin(0, 0)
        this.bg_clouds_a_dupe.setTileScale(3, 3)
        this.bg_clouds_a_dupe.setDepth(-4)
        // this.bg_clouds_a_dupe.setTintFill(0x30303d)
        this.bg_clouds_a_dupe.setTintFill(0x5564a0)
       
        this.bg_clouds_a_dupe.tilePositionY = 0
        this.bg_clouds_a_dupe.toggleFlipY()

        this.tweens.add({
            targets: this.bg_clouds_a_dupe,
            x: -12,
            duration: 3000,
            delay: 600,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        })

        // Clouds B-00
        this.bg_clouds_b = this.add.tileSprite(this.scale.width - 48 * 2, 0, 48 * 2, this.scale.height, 'bg-clouds_b')
        // this.bg_clouds_b.toggleFlipY()

        this.bg_clouds_b.toggleFlipX()
        this.bg_clouds_b.setOrigin(0, 0)
        this.bg_clouds_b.setTileScale(3, 3)
        this.bg_clouds_b.setDepth(-5)
        // this.bg_clouds_b.setTintFill(0x30303d)
        this.bg_clouds_b.setTintFill(0x5564a0)
        
        this.bg_clouds_b.tilePositionY = 24


        this.tweens.add({
            targets: this.bg_clouds_b,
            x: (this.scale.width - 48 * 2) - 12,
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        })

        // Clouds B-01
        this.bg_clouds_b_dupe = this.add.tileSprite(this.scale.width - (48 * 2) * 1.25, 0, 48 * 2, this.scale.height, 'bg-clouds_b')
        this.bg_clouds_b_dupe.toggleFlipX()
        this.bg_clouds_b_dupe.setOrigin(0, 0)
        this.bg_clouds_b_dupe.setTileScale(3, 3)
        this.bg_clouds_b_dupe.setDepth(-4)
        // this.bg_clouds_b_dupe.setTintFill(0x30303d)
        this.bg_clouds_b_dupe.setTintFill(0x5564a0)


        this.tweens.add({
            targets: this.bg_clouds_b_dupe,
            x: (this.scale.width - 48 * 2) + 12,
            delay: 1000,
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        })


        // Clouds C
        this.bg_clouds_c = this.add.tileSprite(-48 / 4, 0, 48 * 2, this.scale.height, 'bg-clouds_b')
        this.bg_clouds_c.setOrigin(0, 0)
        this.bg_clouds_c.setTileScale(3, 3)
        // this.bg_clouds_c.setTintFill(0xea6e48) //0xf7b33d
        this.bg_clouds_c.setTintFill(0x30303d) //0xf7b33d
        
        // this.bg_clouds_c.setDepth(-2)
        
        // Clouds E
        this.bg_clouds_e = this.add.tileSprite(-48 / 2, 0, 48 * 2, this.scale.height, 'bg-clouds_b')
        this.bg_clouds_e.setOrigin(0, 0)
        this.bg_clouds_e.setTileScale(3, 3)
        // this.bg_clouds_e.setTintFill(0xea6e48)
        this.bg_clouds_e.setTintFill(0x30303d)
        // this.bg_clouds_e.setDepth(-1)

        // Clouds D
        this.bg_clouds_d = this.add.tileSprite(this.scale.width - 48 * 1.5, 0, 48 * 2, this.scale.height, 'bg-clouds_b')
        this.bg_clouds_d.toggleFlipX()
        this.bg_clouds_d.setOrigin(0, 0)
        this.bg_clouds_d.setTileScale(3, 3)
        // this.bg_clouds_d.setTintFill(0xea6e48)
        this.bg_clouds_d.setTintFill(0x30303d) 

        // this.bg_clouds_d.setDepth(-2)

        // Clouds F
        this.bg_clouds_f = this.add.tileSprite(this.scale.width - 48 * 1.5, 0, 48 * 2, this.scale.height, 'bg-clouds_b')
        this.bg_clouds_f.toggleFlipX()
        this.bg_clouds_f.setOrigin(0, 0)
        this.bg_clouds_f.setTileScale(3, 3)
        // this.bg_clouds_f.setTintFill(0xea6e48) 
        this.bg_clouds_f.setTintFill(0x30303d) //0xede4da

        
        // this.bg_clouds_f.setDepth(-1)

       

        

        // BOULDERS

        // this.boulderParticle = this.add.particles('bg-boulders')
        // this.boulderParticle.setDepth(-1)
        
        // // const rect1 = new Phaser.Geom.Rectangle(0, this.scale.height, this.scale.width, 100)
        // this.emit_boulders = this.boulderParticle.createEmitter({
        //     x: { min: this.scale.width / 4, max: this.scale.width - this.scale.width / 4 },
        //     y:  this.scale.height + 50,
        //     // scale: { min: 1, max: 1 },
        //     speedY: {
        //         min: -650,
        //         max: -1050
        //     },
        //     // accelerationY: { min: -375, max: -900 }, //-800,
        //     maxParticles: 75,
        //     quantity: { min: 1, max: 3 },
        //     frequency: 200,
        //     lifespan: 1200,
        //     // emitZone: { type: 'random', source: rect1 },
        //     blendMode: 'ADD',
        //     on: true,
        //     // tint: 0x7d8397,
        //     rotate: {min: -200, max: 200},
        //     tint: 0xf7b33d,
        //     alpha: 0.5,
        // })

        
    
        // this.emit_boulders.emitParticle()
        // this.emit_boulders.flow()

        
        /////////////////////////////////////////////////////

        const playerInputState = new PlayerInputState(this.cursors)

        
        
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

        // CREATE PLAYER SPRITE

        // this.player = this.physics.add.sprite(240, 60, 'bunny-stand').setScale(3.0)
        // this.player = this.physics.add.sprite(240, 60, 'yogi-idle').play('yogiIdle').setScale(3.0)
        // this.player = this.physics.add.sprite(240, 60, 'yogi-idle').play('yogiIdle').setScale(3.0)

        /**@type {Player} */
        this.player = new Player(this, this.scale.width / 2, 60, 'yogi-idle')
        this.player.setControlState(playerInputState)
        // this.physics.world.enable(this.player)
        // this.add.existing(this.player)


        // this.player = this.physics.add.sprite(240, 60, 'yogi-idle').setScale(3.0)
        
        // add collision between player and tiles
        this.physics.add.collider(this.platforms, this.player)

        // flash player sprite
        this.playerHitFX = this.tweens.add({
            targets: this.player,
            // alpha: 0,
            alpha: { from: 1, to: 0 },
            duration: 100,
            ease: 'Cubic.easeInOut',
            yoyo: true,
            repeat: 2,
        })

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

        // SCORE TEXT
        // this.scoreText = this.add.bitmapText(240, this.scale.height - 42, 'classified', 'Jewels : 0', 32).setScrollFactor(0).setOrigin(0.5, 0)
        this.scoreText = this.add.bitmapText(this.scale.width / 2, this.scale.height / 2, 'classified', '', 64).setScrollFactor(0).setOrigin(0.5)
        this.scoreText.setTintFill(0x61c7ac)
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
        // this.physics.add.collider(this.player, this.spikes, this.handlePlayerDeath, undefined, this) //slowDown

        // spike collide with player
        this.playerObstacleCollider = this.physics.add.overlap(this.player, this.spikes, this.slowDown, undefined, this) //slowDown

        this.shadowFX = this.add.particles('yogi-jump')

        this.shadowEmitter = this.shadowFX.createEmitter({
            // x: this.player.x ,
            // y: 1,
            // scale: {start: 3, end: 0},
            scale: 3,
            alpha: {start: 1, end: 0},
            tint: 0xffffff,
            // tint: 0x61b7ac,
            frame: this.player.anims.currentFrame.index,
            quantity: 1,
            frequency: 70,
            speedY: -100,
            lifespan: 250,
            particleClass: PlayerShadow,
            blendMode: 'ADD',
            rotate: {min: -500, max: -500},
        })

        this.shadowEmitter.startFollow(this.player.body, this.player.body.width, this.player.body.height )
        // // this.shadowEmitter.startFollow(this.player, this.player.width, this.player.height )


        // restart scene
        this.input.keyboard.once('keydown_R', () => {
            if (this.scene.isActive('pause')){
                this.scene.stop('pause')
            }

            if (this.scene.isActive('game-over')){
                this.scene.stop('game-over')
            }
            if (!this.scene.isActive('menu')){
                this.scene.restart('game')
            }
        })

        this.pauseButton = this.input.keyboard.addKey('P')
        // this.debugButton = this.input.keyboard.addKey('A')

        // PLAY MAIN THEME MUSIC

        const mainTheme = this.sound.add('main-theme', {
            volume: 0.7,
            loop: true
        })

        // this.timedEvent = this.time.delayedCall(1500, this.spawnPlatform(4), [], this)
        // this.timedEvent = this.time.addEvent({ delay: 700, callback: this.spawnPlatform, args: [], callbackScope: this})

        mainTheme.play()
        
    }

    update(t, dt){

        if (GameOptions.inGameScene){
            this.spawnPlatform()
            GameOptions.inGameScene = !GameOptions.inGameScene
        }
        
        this.bg_clouds_a.tilePositionY += 0.75
        this.bg_clouds_a_dupe.tilePositionY -= 0.65
        
        this.bg_clouds_b.tilePositionY += 0.80
        this.bg_clouds_b_dupe.tilePositionY += 0.85
        
        this.bg_clouds_c.tilePositionY += 2
        this.bg_clouds_d.tilePositionY += 2
        this.bg_clouds_e.tilePositionY += 1.75
        this.bg_clouds_f.tilePositionY += 1.75
        
        
        // const value = `Jewels: ${this.score}`
        if (GameOptions.isGameStart){
            this.score = GameOptions.currentGameScore
            const value = `${this.score} ft`
            this.scoreText.text = value
        }
        if (this.scene.isActive('menu')){
            this.player.setVisible(false)
            
            this.shadowEmitter.setVisible(false)
        } else {
            this.player.update()
            this.player.setVisible(true)
            
            this.shadowEmitter.setVisible(true)
        }
        // console.log(`Score >> ${value} current game score >> ${GameOptions.currentGameScore}`)

        const isPauseDown = Phaser.Input.Keyboard.JustDown(this.pauseButton) 
        
        if (!this.scene.isActive('menu') && isPauseDown && !this.scene.isPaused() && !this.scene.isActive('game-over')){
            this.scene.pause('game')
            this.scene.launch('pause', {score : this.score})
        } 

        
        // HANDLING PLATFORMS
        // gradually increase speed y 
        // GameOptions.platformSpeedLevel[1] += 0.15

        /** @type {Platform} */
        this.platforms.getChildren().forEach(function(platform){
            // console.log(`PLATFORM NAME : ${platform.name}`)
            
            // platform.update()
            // scroll texture vertically
            // platform.tilePositionY++
            // console.log(`PLATFORM VELOCITY ${platform.body.velocity.y}`)

            // platform.body.velocity.y = GameOptions.platformStartSpeed * (-1 * dt)
            
            // if (this.score > 50 && this.score < 100){
            // }
            
            // Spawn next plaform based on distance from bottom of screen to bottom of platform
            let spawnDistance
            let platBottom    = platform.y + platform.displayHeight
            if (GameOptions.isGameStart){
                spawnDistance = this.scale.height - (16 * 3) * Phaser.Math.RND.integerInRange(GameOptions.platformSizeRange[0], GameOptions.platformSizeRange[1])

                platform.body.velocity.y = GameOptions.platformSpeedLevel[1] * (-1 * dt)

                // PLATFORM SPEED INCREASE And Limit
                if (GameOptions.platformSpeedLevel[1] > GameOptions.platformMaxSpeed){
                    GameOptions.platformSpeedLevel[1] = GameOptions.platformMaxSpeed
                    // console.log(`hit Plat Max Speed ${GameOptions.platformMaxSpeed}`)
                } else if (GameOptions.platformSpeedLevel[1] >= GameOptions.platformMaxSpeed * GameOptions.curveLevel[2]){

                    // console.log(`Speed Level : 1 > ${GameOptions.platformSpeedLevel[1]}`)
                    GameOptions.platformSpeedLevel[1] += (0.000005 * dt)
                    
                } else if (GameOptions.platformSpeedLevel[1] >= GameOptions.platformMaxSpeed * GameOptions.curveLevel[1]){
                    
                    // console.log(`Speed Level : 2 > ${GameOptions.platformSpeedLevel[1]}`)
                    GameOptions.platformSpeedLevel[1] += (0.00009 * dt)
                    
                } else if (GameOptions.platformSpeedLevel[1] >= GameOptions.platformMaxSpeed * GameOptions.curveLevel[0]){
                    
                    // console.log(`Speed Level : 3 > ${GameOptions.platformSpeedLevel[1]}`)
                    GameOptions.platformSpeedLevel[1] += (0.0006 * dt)
                    
                } else {
                    
                    GameOptions.platformSpeedLevel[1] += (0.005 * dt)
                    // console.log(`Speed Level : 4 > ${GameOptions.platformSpeedLevel[1]}`)

                } 


            } else {
                spawnDistance = this.scale.height - (16 * 3) * 0 //- platform.displayHeight
                platform.body.velocity.y = GameOptions.platformStartSpeed * (-1 * dt)

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
            spike.body.velocity.y =  GameOptions.platformSpeedLevel[1] * (-1 * dt)

            // console.log(`SPIKE HAS COLLIDER?> ${spike.body.collider}`)

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


        // Check Arcade Physics if player colliding below
        const touchingLeft = this.player.body.touching.left
        const touchingRight = this.player.body.touching.right
        if (touchingLeft || touchingRight){
            if (!GameOptions.isGameStart){
                GameOptions.isGameStart = true
            }
            this.grindParticles(touchingRight)
            if (!this.player.flippingGrav){
                this.shadowEmitter.stop()
                this.player.flippingGrav = true
            }
        } else {
            if (this.player.jumpCount >= 1 && this.player.flippingGrav){
                this.shadowEmitter.start()
                this.player.flippingGrav = false
                // this.shadowEmitter.startFollow(this.player.body, this.player.body.width, this.player.body.height )
                
            }
        }

        if (GameOptions.isGameStart) {
            this.wordlBoundKill(this.player)
        }


        if (this.player.x > this.scale.width || this.player.x < -this.player.displayWidth){
            this.handlePlayerDeath()
        }
    }

    

    grindParticles(touchDir) {
        // Particle emmiter for wall sliding
        let grindPositionX
        let grindPositionY = this.player.y + this.player.displayHeight 
        let velocityX
        let startAngle
        if (touchDir){
            // console.log(`is touching RIGHT ${touchingRight}`)
            grindPositionX = (this.player.x + this.player.displayWidth ) 
            velocityX = {min : 80, max : 100}
        } else {
            // console.log(`is touching LEFT ${touchingLeft}`)
            grindPositionX = this.player.x 
            velocityX = {min : -80, max : -100}
        }

        const emitterGrind = this.particlesGrind.createEmitter({
            scale: 3,
            // speedX: velocityX,
            speedY: {
                min: -350,
                max: -550
            },
            maxParticles: 1,
            tint: 0xede4da,
            
        })

        this.particlesGrind.setDepth(0)
        
        emitterGrind.emitParticleAt(grindPositionX, grindPositionY)
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

    // findBottomMostPlatform(){
    //     const platforms = this.platforms.getChildren()
    //     let bottomPlatform = platforms[0]

    //     for (let i = 1; i < platforms.length; ++i){
    //         const platform = platforms[i]

    //         // discard any platforms that are above the current
    //         if (platform.y < bottomPlatform.y){
    //             continue
    //         }

    //         bottomPlatform = platform
    //     }

    //     return bottomPlatform
    slowDown(player, spike){
    // }

        // remove collider
        this.physics.world.removeCollider(spike) // collider
        
        // flash player sprite
        if (!this.playerHitFX.isPlaying()){
            console.log(`============================================`)
            console.log(`SPIKE : ${Object.keys(spike)}`)
            this.playerHitFX.play()
            
            this.tweens.add({
                targets: spike,
                alpha: { from: 1, to: 0 },//0,
                duration: 100,
                ease: 'Cubic.easeInOut',
                yoyo: true,
                repeat: 5,
            })

            this.cameras.main.shake(90, 0.01)
            // console.log(`is tween playing? ${this.playerHitFX.isPlaying()}`)
            GameOptions.platformSpeedLevel[1] -=  5
            
            
            // if (GameOptions.platformSpeedLevel[1] < 0) {
            //     // console.log(`Platform Speed Before : ${GameOptions.platformSpeedLevel[1]}`)
            //     GameOptions.platformSpeedLevel[1] = 0
            //     // console.log(`Platform Speed After : ${GameOptions.platformSpeedLevel[1]}`)
                
            // } else {
            //     // console.log(`Platform Speed Before : ${GameOptions.platformSpeedLevel[1]}`)
            //     // GameOptions.platformSpeedLevel[1] -=  5
            //     // console.log(`Platform Speed After : ${GameOptions.platformSpeedLevel[1]}`)
            // }
            

        }
    }


    handlePlayerDeath(){
        // console.log(`============================================`)
        // console.log(`Game Over - End Score : ${this.score}`)
        // console.log(`Platform Speed : ${GameOptions.platformSpeedLevel[1]}`)

        if (this.scene.isActive('pause')){
            this.scene.stop('pause')
        }
        this.scene.launch('game-over', {score : this.score})
        GameOptions.isGameStart = false
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

        const halfHeight = sprite.displayHeight * 0.5
        const gameHeight = this.scale.height
        if (sprite.x < -halfWidth){
            this.handlePlayerDeath()
        } else if (sprite.x > gameWidth + halfWidth){
            this.handlePlayerDeath()
        } else if (sprite.y < -halfHeight){
            this.handlePlayerDeath()
        } else if (sprite.y > gameHeight + halfHeight){
            this.handlePlayerDeath()
        }
    }

    // platform spawner. level difficulty
    spawnPlatform(tileCount = Phaser.Math.RND.integerInRange(GameOptions.platformSizeRange[0], GameOptions.platformSizeRange[1]), spawnLeft = Phaser.Math.RND.pick([true, false])){
        let x
        let tileSize = (16 * 3)
        /** @type {Phaser.GameObjects.TileSprite} */
        let myPlatform

        // Set horizontal spawn position
        if (spawnLeft){
            x = 0
        } else {
            if (GameOptions.isGameStart && this.score > GameOptions.levelDifficulty[0]){
                x = this.scale.width - tileSize
            } else {
                x = 0
            }
        }

        let y = this.scale.height

        let platformHeight = 16 * tileCount
        // let platformHeight = 16


        if(this.platformPool.getLength()){
            myPlatform = this.platformPool.getFirst()
            myPlatform.x = x
            myPlatform.y = y
            myPlatform.setActive(true)
            myPlatform.setVisible(true)

            this.platformPool.remove(myPlatform)
        }
        else{
            // myPlatform = this.add.tileSprite(x, y, 16, platformHeight, 'platform-left')
            // myPlatform.setOrigin(0, 0)   
            
            myPlatform = this.platforms.get(x, y)
            myPlatform.setTexture('platform-left')

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
        if (spawnLeft){
            // myPlatform.setFlipX(false)
            myPlatform.setTexture('platform-left')
        } else {
            if (GameOptions.isGameStart && this.score > GameOptions.levelDifficulty[0]){
                myPlatform.setTexture('platform-right')
                // myPlatform.setFlipX(true)
            }
        }

        if (this.score > GameOptions.levelDifficulty[1] && GameOptions.isGameStart) {
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
                
                if(this.spikePool.getLength() > 7){
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