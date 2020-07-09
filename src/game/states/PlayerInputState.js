import Phaser from '../../lib/phaser.js'
import GameOptions from '../../GameOptions.js'

export default class PlayerInputState {
    /**
     * @param {Phaser.Types.Input.CursorKeys} cursors
     */
    constructor(cursors){
        this.cursors = cursors
    }

    /**
     * 
     * @param {Phaser.Physics.Arcade.Sprite} player 
     */

    update(player){
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const body = player.body

        const isJustDownJump = Phaser.Input.Keyboard.JustDown(this.cursors.space) 
        const isJustUpJump = Phaser.Input.Keyboard.JustUp(this.cursors.space) 
        const touchingLeft = body.touching.left
        const touchingRight = body.touching.right

        let candoubleJump = player.jumpCount < player.playerJumpCount
        
        if (!GameOptions.isGameStart){
            if (isJustDownJump){
                body.gravity.x = player.playerGravity * -1
            }

            if(touchingLeft || touchingRight) {
                GameOptions.isGameStart = true
                console.log(`start game? ${GameOptions.isGameStart}`)
            }
        } else {
            
            if(touchingLeft || touchingRight) {

                GameOptions.currentGameScore++
                player.jumpCount = 0

                player.play('yogiIdle', true)
                
                if (isJustDownJump && candoubleJump){
                    player.jumpCount++
                    body.setVelocityX(player.playerJumpForce)
                }
            } else {
                player.play('yogiJump', true)
                if (candoubleJump){
                    
                    if (isJustDownJump){
                        if (player.jumpCount < 1) {
                            player.jumpCount++
                            body.setVelocityX(player.playerJumpForce)
                        } else {
                            player.toggleFlipX()
    
                            body.gravity.x *= -1
                            player.playerJumpForce *= -1 
                            body.setVelocityX( -player.playerJumpForce )
                            player.jumpCount++
                        }
                        
                    } else if (isJustUpJump){
                        body.setVelocityX(0)
                    }
                }
            }
        }
    }
}