import Phaser from '../../lib/phaser.js'

export default class PlayerInputState {
    /**
     * @param {Phaser.Types.Input.CursorKeys} cursors
     */
    constructor(cursors){
        this.cursors = cursors
    }

    update(player){
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const body = player.body

        const isJustDownJump = Phaser.Input.Keyboard.JustDown(this.cursors.space) 
        const isJustUpJump = Phaser.Input.Keyboard.JustUp(this.cursors.space) 

        // let candoubleJump = this.jumpCount < GameOptions.playerJumpCount

        if (this.cursors.space.isDown){
            player.x += 10
            body.updateFromGameObject()
        } else if (this.cursors.left.isDown){
            player.x -= 10
            body.updateFromGameObject()
        }
    }
}