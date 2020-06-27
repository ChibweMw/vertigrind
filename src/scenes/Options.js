import Phaser from '../lib/phaser.js'

export default class Options extends Phaser.Scene{
    constructor(){
        super('options')
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
        console.log('Options Scene')
        // const style = { color: '#fff', fontSize: 24}
        this.add.bitmapText(width * 0.5, height * 0.25, 'babyblocks', 'Options', 32).setOrigin(0.5)

        this.input.keyboard.once('keydown_ENTER', () => {
            this.scene.start('menu')
        })
    }
}