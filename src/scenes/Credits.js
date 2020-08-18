import Phaser from '../lib/phaser.js'

export default class Credits extends Phaser.Scene{
    constructor(){
        super('credits')
    }

    init(){
        this.sound.stopAll()
    }

    preload(){
        // this.load.bitmapFont('classified', 'assets/fonts/classified.png', 'assets/fonts/classified.xml')
    }

    create(){
        // use ScaleManager to get with and height of game
        const width = this.scale.width
        const height = this.scale.height
        console.log('Credits Scene')
        // const style = { color: '#fff', fontSize: 24}
        this.add.bitmapText(width * 0.5, height * 0.25, 'classified', 'Credits', 32).setOrigin(0.5)
        this.add.bitmapText(width * 0.5, height * 0.25 + 34 * 2, 'classified', 'Created by @luckydothraki', 16).setOrigin(0.5)
        this.add.bitmapText(width * 0.5, height * 0.25 + 34 * 3, 'classified', 'Font by @ChevyRay', 16).setOrigin(0.5)
        this.add.bitmapText(width * 0.5, height * 0.25 + 34 * 4, 'classified', 'Music & Audio by [insert name]', 16).setOrigin(0.5)

        this.input.keyboard.once('keydown_SPACE', () => {
            this.scene.start('menu')
        })
    }
}