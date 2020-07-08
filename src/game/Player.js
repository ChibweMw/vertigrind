import Phaser from '../lib/phaser.js'

export default class Player extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} Scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     */
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)

        scene.physics.add.existing(this, true)
        this.setScale(3.0)
        this.setOrigin(0, 0)
        this.setDepth(2)

        this.controlState = undefined
    }

    setControlState(controlState){
        this.controlState = controlState
    }

    update(){
        if (!this.controlState){
            return
        }

        this.controlState.update(this)
    }
}