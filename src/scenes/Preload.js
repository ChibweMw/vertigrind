import Phaser from '../lib/phaser.js'

export default class PreLoad extends Phaser.Scene {

    constructor (){
        super('preload')
    }

    preload (){
        this.load.image('logo', 'assets/sprites/Branding/Logo.png')

        // Load bg clouds image for parallax
        this.load.image('bg-clouds_a', 'assets/sprites/Background/bg-clouds-1.png')
        this.load.image('bg-clouds_b', 'assets/sprites/Background/bg-clouds-3.png')
        // Load Boulder bg image
        this.load.image('bg-boulders', 'assets/sprites/Background/bg_Boulders-02.png')
        
        // load a platform image
        // this.load.image('platform-left', 'assets/sprites/Environment/ground_wavy.png') //tile_0132.png
        this.load.image('platform-left', 'assets/sprites/Environment/tile_0168.png') //tile_0132.png
        this.load.image('platform-right', 'assets/sprites/Environment/tile_0171.png') //tile_0132.png
        
        this.load.image('bunny-stand', 'assets/sprites/Player/yogi-test.png')
        
        this.load.image('bunny-jump', 'assets/sprites/Player/bunny_jump.png')
        
        // yogi assets
        // this.load.spritesheet('yogi-idle', 'assets/sprites/Player/anim_idle.png', { frameWidth: 14, frameHeight: 18, startFrame: 0, endFrame: 2 })
        this.load.spritesheet('yogi-idle', 'assets/sprites/Player/anim_idle-03.png', { frameWidth: 14, frameHeight: 18, startFrame: 0, endFrame: 2 })
        // this.load.spritesheet('yogi-jump', 'assets/sprites/Player/anim_jump.png', { frameWidth: 10, frameHeight: 10, startFrame: 0, endFrame: 3 })
        // this.load.spritesheet('yogi-jump', 'assets/sprites/Player/anim_jump-02.png', { frameWidth: 11, frameHeight: 10, startFrame: 0, endFrame: 3 })
        this.load.spritesheet('yogi-jump', 'assets/sprites/Player/anim_jump-05.png', { frameWidth: 11, frameHeight: 11, startFrame: 0, endFrame: 3 })

        // load jewel image
        this.load.image('jewel', 'assets/sprites/Items/collectible_diamond.png')

        // load obstacle
        // this.load.image('spike', 'assets/sprites/Environment/obstacle_spike.png')
        // this.load.image('spike', 'assets/sprites/Environment/obstacle_spike-02.png')
        this.load.image('spike', 'assets/sprites/Environment/obstacle_spike-11.png')
        
        // load particles
        this.load.image('particle-Grind-1', 'assets/sprites/Player/particle_grind-1.png')
        this.load.image('particle-Grind-2', 'assets/sprites/Player/particle_grind-2.png')
        this.load.image('particle-Grind-3', 'assets/sprites/Player/particle_grind-3.png')

        this.load.audio('jump', 'assets/sfx/jump-4.wav')
        this.load.audio('collect-jewel', 'assets/sfx/collect-1.wav')

        this.load.audio('main-theme', 'assets/music/Pixel-War-1.wav')

        this.load.bitmapFont('classified', 'assets/fonts/classified.png', 'assets/fonts/classified.xml')

        this.load.on('complete', this.complete, this)

    }

    complete () {
        console.log(`COMPLETE!`)
        this.scene.start('menu')
    }
}