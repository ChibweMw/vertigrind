import Phaser from '../lib/phaser.js'

export default class PreLoad extends Phaser.Scene {

    constructor (){
        super('boot')
    }

    preload (){
        this.load.bitmapFont('classified', 'assets/fonts/classified.png', 'assets/fonts/classified.xml')

        this.load.on('complete', this.complete, this)
    }

    complete () {
        console.log(`COMPLETE!`)
        this.scene.start('preload')
    }
}