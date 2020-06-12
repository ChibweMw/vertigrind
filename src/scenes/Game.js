import Phaser from  '../lib/phaser.js'

export default class Game extends Phaser.Scene{
    
    constructor(){
        super('game')
    }

    preload(){
        this.load.image('test-bg', 'assets/sprites/Background/bg_brick.png')
        
        // load a platform image
        this.load.image('test-platform', 'assets/sprites/Environment/ground_wavy.png')
    }

    create(){
        this.add.image(240, 320, 'test-bg')

        // add platform image
        // this.add.image(140, 320, 'test-platform')
        // this.physics.add.image(240, 320, 'test-platform')
        const platforms = this.physics.add.staticGroup()

        for (let i = 0; i < 5; ++i){

            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = platforms.create(x, y, 'test-platform')
            
            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()
        }
    }
}