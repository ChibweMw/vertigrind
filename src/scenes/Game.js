import Phaser from  '../lib/phaser.js'

// import Jewel class here
import Jewel from '../game/Jewel.js'
import Spike from '../game/Spike.js'
import GameOptions from '../GameOptions.js'

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
    pauseButton
    // /** @type {Phaser.GameObjects.Particles} */
    particlesGrind

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
        
        this.load.image('bunny-stand', 'assets/sprites/Player/bunny_grind-2.png')
        
        this.load.image('bunny-jump', 'assets/sprites/Player/bunny_jump.png')

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

        this.particlesGrind = this.add.particles('particle-Grind-1')
        
        console.log(`Screen height : ${this.scale.height}`)            

        // start adding colliders to platforms
        this.platforms = this.physics.add.group({
            classType: Phaser.GameObjects.TileSprite,   
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

        // create a bunny sprite
        this.player = this.physics.add.sprite(240, 60, 'bunny-stand').setScale(3.0)
        
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
        this.jewelsCollectedText = this.add.bitmapText(240, 10, 'babyblocks', 'Jewels : 0', 24).setScrollFactor(0).setOrigin(0.5, 0)
        
        // start adding colliders to spikes

        this.spikes = this.physics.add.group({
            classType: Spike,   
            immovable: true,
            allowGravity: false,
            maxSize: 30,
            velocityY: (GameOptions.platformStartSpeed * -1),
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

        this.pauseButton = this.input.keyboard.addKey('P')

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

        const isPauseDown = Phaser.Input.Keyboard.JustDown(this.pauseButton) 
        
        if (isPauseDown && !this.scene.isPaused()){
            // console.log('PAUSE')
            this.scene.pause('game')
            this.scene.launch('pause', {score : this.jewelsCollected})
        } 
        // HANDLING PLATFORMS
        this.platforms.getChildren().forEach(function(platform){
            // console.log(`PLATFORM NAME : ${platform.name}`)

            platform.update()
            // scroll texture vertically
            // platform.tilePositionY++

            
            // Spawn next plaform based on distance from bottom of screen to bottom of platform
            let spawnDistance = this.scale.height - (16 * 3) * Phaser.Math.RND.integerInRange(GameOptions.platformSizeRange[0], GameOptions.platformSizeRange[1])
            // let spawnDistance = this.scale.height - (16 * 3)
            
            let platBottom    = platform.y + platform.displayHeight
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
            this.isGameStart = true
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
            this.jumpCount = 0

            // Particle emmiter for wall sliding
            let grindPosition
            let velocityX
            let startAngle
            if (touchingRight){
                grindPosition = this.player.x + this.player.width / 2
                velocityX = {min : 150, max : 550}
            } else {
                grindPosition = this.player.x - this.player.width / 2
                velocityX = {min : -150, max : -550}
            }

            const emitterGrind = this.particlesGrind.createEmitter({
                scale: 3,
                speedX: velocityX,
                speedY: {
                    min: -350,
                    max: -550
                },
                maxParticles: 1
            })

            this.particlesGrind.setDepth(emitterGrind)
            
            emitterGrind.emitParticleAt(grindPosition, this.player.y)

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
        if (this.scene.isActive('pause')){
            this.scene.stop('pause')
        }
        this.scene.start('game-over', {score : this.jewelsCollected})
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
            x = this.scale.width - tileSize
        }

        const y = this.scale.height

        let platformHeight = 16 * tileCount
        // let platformHeight = 16

        // console.log(`==================================`)
        
        // console.log(`Tile count : ${tileCount}`)
        
        // console.log(`==================================`)

        // console.log(`PlatformHeight : ${platformHeight}`)
        // console.log(`PlatformHeight x 3 : ${platformHeight * 3}`)
   


        let myPlatform

        if(this.platformPool.getLength()){
            // console.log('PLATFORM RECYLED')
            myPlatform = this.platformPool.getFirst()
            // console.log(`MYPLATS : ${myPlatform}`)
            // myPlatform.height = myPlatform.height * 3
            // console.log(`RECYCLED Plain Height : ${myPlatform.height}`)
            // console.log(`RECYCLED Plain Height x 3 : ${myPlatform.height * 3}`)

            myPlatform.x = x
            myPlatform.y = y
            myPlatform.setActive(true)
            myPlatform.setVisible(true)

            this.platformPool.remove(myPlatform)
        }
        else{
            // console.log('PLATFORM CREATED')
            myPlatform = this.add.tileSprite(x, y, 16, platformHeight, 'test-platform')
            myPlatform.setOrigin(0, 0)
            myPlatform.setSize(myPlatform.width, myPlatform.height)
            myPlatform.setScale(3.0)

            this.platforms.add(myPlatform)            
        }
        
        // console.log(`DISPLAYHEIGHT : ${myPlatform.displayHeight}`)
        // console.log(`Plain Height : ${myPlatform.height}`)

        if (this.jewelsCollected > 100) {
            console.log(`passed 10 points`)

            // is there a spike over the platform?
            if(Phaser.Math.Between(1, 100) <= 40){
                // console.log(`========================`)
    
                let spike
                let spikeX
                let spikeTileCount = tileCount - 1
                let currentPlacement = Math.floor(Phaser.Math.RND.integerInRange(0, spikeTileCount))
                let spikePlacementY = tileSize * currentPlacement
                // console.log(`Possible Spike Placements : ${spikeTileCount + 1}`)
                // console.log(`Current Placement : ${currentPlacement}`)            
                // console.log(`Relative Spike Pos Y : ${spikePlacementY}`)            
                // console.log(`Base Tile Size : ${tileSize}`)            
                
                let spikePosY = y + spikePlacementY
                // console.log(`SPIKE PosY : ${spikePosY}`)
                
                let spikeHitBoxOffsetx
                
                if (x > 0){
                    spikeX = tileSize
                    spikeHitBoxOffsetx = 12
                } else {
                    spikeX = -tileSize
                    spikeHitBoxOffsetx = 0
                }
                // console.log(`Spike Pos X : ${spikeX}`)            
    
                if(this.spikePool.getLength()){
                    spike = this.spikePool.getFirst()
                    spike.x = x - spikeX 
                    spike.y = spikePosY
                    spike.active = true
                    spike.visible = true
                    spike.body.setOffset(spikeHitBoxOffsetx, spike.height / 2)
                    this.spikePool.remove(spike)
                }
                else{
                    spike = this.physics.add.sprite(x - spikeX, spikePosY, "spike")
                    spike.setImmovable(true)
                    spike.setOrigin(0, 0)
                    spike.setScale(3.0)
                    spike.setSize(4, 8, true) // 'true' is set to center hitbox
                    spike.body.setOffset(spikeHitBoxOffsetx, spike.height / 2)
                    spike.setDepth(2)
                    this.spikes.add(spike)
                }
            }
            
        }
    }
}