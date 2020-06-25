import Phaser from '../lib/phaser.js'

export default class Pause extends Phaser.Scene{
    constructor(){
        super('pause')
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
        const overlay = this.add.graphics({
            x: 0,
            y: 0,
            fillStyle: {
                color: 0x000000,
                alpha: 0.3
            }
        })
        overlay.fillRect(0, 0, width, height)

        console.log('Pause Scene')
        // const style = { color: '#fff', fontSize: 24}
        this.add.bitmapText(width * 0.5, height * 0.25, 'babyblocks', 'Paused', 32).setOrigin(0.5)

        this.input.keyboard.once('keydown_ENTER', () => {
            this.scene.resume('game')
        })

        this.input.keyboard.once('keydown_P', () => {
            this.scene.resume('game')
            this.scene.setVisible(false)
        })


    }
}