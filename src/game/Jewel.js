import Phase from '../lib/phaser.js'

export default class Jewel extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} Scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     */
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)

        this.setScale(3.0)
    }
}