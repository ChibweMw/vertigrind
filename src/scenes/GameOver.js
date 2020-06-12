import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene{
    constructor(){
        super('game-over')
    }

    create(){
        // use ScaleManager to get with and height of game
        const width = this.scale.width
        const height = this.scale.height
        console.log('Game Over')
        // const style = { color: '#fff', fontSize: 24}
        this.add.text(width * 0.5, height * 0.5, 'Game Over', { color: '#fff', fontSize: 24}).setOrigin(0.5)
        
        this.input.keyboard.once('keydown_SPACE', () => {
            this.scene.start('game')
        })
    }
}