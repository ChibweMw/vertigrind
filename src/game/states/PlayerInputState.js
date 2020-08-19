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
        
        // console.log(`player jump count ${player.jumpCount} can double jump? ${candoubleJump}`)
        if (!GameOptions.isGameStart){
            if (isJustDownJump){
                body.gravity.x = player.playerGravity * -1
            }

            if(touchingLeft || touchingRight) {
                GameOptions.isGameStart = true
            }
        } else {
            // GAME HAS STARTED
            if(touchingLeft || touchingRight) {

                GameOptions.currentGameScore++
                player.jumpCount = 0

                player.play('yogiIdle', true)
                
                if (isJustDownJump && candoubleJump){
                    player.jumpCount++
                    body.setVelocityX(player.playerJumpForce)
                    // this.sound.play('player-jump')
                }
            } else {
                player.play('yogiJump', true)
                if (candoubleJump){
                    
                    if (isJustDownJump){
                        if (player.jumpCount < 1) {
                            body.setVelocityX(player.playerJumpForce)
                        } else {
                            player.toggleFlipX()
    
                            body.gravity.x *= -1
                            player.playerJumpForce *= -1 
                            body.setVelocityX( -player.playerJumpForce )
                        }
                        // ADD TO JUMP COUNT AND EXIT CONDITIONAL BLOCK
                        player.jumpCount++
                        
                    } else if (isJustUpJump){
                        // SNAPPY FALL 
                        // body.setVelocityX(-player.playerJumpForce / 2)
                        // FLOATY, HAS LONGJUMP
                        body.setVelocityX(0)
                    }
                }
            }
        }
    }
}