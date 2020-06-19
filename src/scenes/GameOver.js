import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene{
    constructor(){
        super('game-over')
    }

    preload(){
        this.load.bitmapFont('babyblocks', 'assets/fonts/babyblocks.png', 'assets/fonts/babyblocks.xml')

    }

    create(){
        // use ScaleManager to get with and height of game
        const width = this.scale.width
        const height = this.scale.height
        console.log('Game Over')
        // const style = { color: '#fff', fontSize: 24}
        this.add.bitmapText(width * 0.5, height * 0.5, 'babyblocks', 'Game Over', 44).setOrigin(0.5)
        
        this.input.keyboard.once('keydown_R', () => {
            this.scene.start('menu')
        })

        this.input.keyboard.once('keydown_SPACE', () => {
            this.scene.start('game')
        })
    }
}