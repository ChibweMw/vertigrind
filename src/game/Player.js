import Phaser from '../lib/phaser.js'

import GameOptions from '../GameOptions.js'


export default class Player extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} Scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     */
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)
        
        scene.physics.add.existing(this)
        scene.add.existing(this)
        scene.physics.world.enable(this)

        this.play('yogiIdle', true)

        this.setScale(3.0)
        this.setOrigin(0, 0)
        this.setDepth(2)

        this.controlState = undefined

        this.playerGravity =  GameOptions.playerGravity
        this.playerJumpForce = GameOptions.playerJumpForce
        this.playerJumpCount = GameOptions.playerJumpCount

        this.jumpCount = 0

        
    }

    setControlState(controlState){
        this.controlState = controlState
    }
    
    update(){
        if (!this.controlState){
            console.log(`control state >> ${this.controlState}`)
            return
        }

        // Player Animation State Machine
        // Player Status State Machine

        // Player Input State Machine
        this.controlState.update(this)
    }
}