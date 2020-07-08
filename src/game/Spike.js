import Phaser from '../lib/phaser.js'

export default class Spike extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} Scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     */
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)

        this.setScale(3.0)
        this.setOrigin(0, 0)
        this.setDepth(2)
    }
}