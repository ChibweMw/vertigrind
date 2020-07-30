import Phaser from '../lib/phaser.js'

export default class Credits extends Phaser.Scene{
    constructor(){
        super('credits')
    }

    init(){
        this.sound.stopAll()
    }

    preload(){
        this.load.bitmapFont('babyblocks', 'assets/fonts/babyblocks.png', 'assets/fonts/babyblocks.xml')
    }

    create(){
        // use ScaleManager to get with and height of game
        const width = this.scale.width
        const height = this.scale.height
        console.log('Credits Scene')
        // const style = { color: '#fff', fontSize: 24}
        this.add.bitmapText(width * 0.5, height * 0.25, 'babyblocks', 'Credits', 32).setOrigin(0.5)
        this.add.bitmapText(width * 0.5, height * 0.25 + 34 * 2, 'babyblocks', 'Created by @luckydothraki', 16).setOrigin(0.5)
        this.add.bitmapText(width * 0.5, height * 0.25 + 34 * 3, 'babyblocks', 'Font by @ChevyRay', 16).setOrigin(0.5)
        this.add.bitmapText(width * 0.5, height * 0.25 + 34 * 4, 'babyblocks', 'Music & Audio by [insert name]', 16).setOrigin(0.5)

        this.input.keyboard.once('keydown_ENTER', () => {
            this.scene.start('menu')
        })
    }
}