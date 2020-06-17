import Phaser from '../lib/phaser.js'

export default class Credits extends Phaser.Scene{
    constructor(){
        super('credits')
    }

    init(){
        this.sound.stopAll()
    }

    preload(){

    }

    create(){
        // use ScaleManager to get with and height of game
        const width = this.scale.width
        const height = this.scale.height
        console.log('Credits Scene')
        // const style = { color: '#fff', fontSize: 24}
        this.add.text(width * 0.5, height * 0.25, 'Credits', { color: '#fff', fontSize: 24}).setOrigin(0.5)

        this.input.keyboard.once('keydown_ENTER', () => {
            this.scene.start('menu')
        })
    }
}