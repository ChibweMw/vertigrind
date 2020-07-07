import Phaser from '../lib/phaser.js'

export default class Platform extends Phaser.GameObjects.TileSprite {
    /**
     * @param {Phaser.Scene} Scene
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {string} texture
     * @param {string | number} frame
     */
    constructor(scene, x, y, width, height, texture, frame){
        super(scene, x, y, width, height, texture, frame)

        this.setScale(3.0)
        this.setOrigin(0, 0)
        // this.setDepth(2)
    }
}