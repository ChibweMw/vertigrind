import Phaser from '../lib/phaser.js'

export default class Pause extends Phaser.Scene{
    
    currentScore
    
    constructor(){
        super('pause')
    }
    

    init(data){
        this.sound.stopAll()
        this.currentScore = data.score
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
                alpha: 0.6
            }
        })
        overlay.fillRect(0, 0, width, height)

        console.log('Pause Scene')
        this.add.bitmapText(width * 0.5, height * 0.25, 'babyblocks', 'Paused', 42).setOrigin(0.5)
        this.add.bitmapText(width * 0.5, height * 0.25 + 42, 'babyblocks', `Score : ${this.currentScore}`, 22).setOrigin(0.5)
        this.add.bitmapText(10, 10, 'babyblocks', "'Q' for Main Menu", 16).setOrigin(0, 0)
        this.add.bitmapText(10, 10 + 18, 'babyblocks', "'P' to resume", 16).setOrigin(0, 0)

        this.input.keyboard.once('keydown_Q', () => {
            this.scene.stop('game')
            this.scene.start('menu')
        })

        this.input.keyboard.once('keydown_P', () => {
            this.scene.resume('game')
            this.scene.setVisible(false)
        })


    }
}