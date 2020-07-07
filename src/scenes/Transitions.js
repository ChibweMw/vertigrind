import Phaser from '../lib/phaser.js'

const MASK_MIN_SCALE = 0
const MASK_MAX_SCALE = 2

export default class SceneTransition extends Phaser.Scene {
    // mask
    
    create (){
        /**@type {Phaser.Geom.Circle} */
        const maskShape = new Phaser.Geom.Circle(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            this.sys.game.config.width / 2
        )

        let maskGfx = this.add.graphics().setDefaultStyles({
                fillStyle: {
                    color: 0x4B0082 //0xff4499//0x000000,
                }
            }).fillCircleShape(maskShape).generateTexture('mask')
        

        this.mask = this.add.image(0, 0, 'mask').setPosition(this.sys.game.config.width / 2, this.sys.game.config.width / 2) 
        // this.mask = maskGfx.createGeometryMask()

        this.cameras.main.setMask( new Phaser.Display.Masks.BitmapMask(this, this.mask))

        this.events.on(Phaser.Scenes.Events.CREATE, () => {
            const propertyConfig = {
                ease: 'Expo.easeInOut',
                from: MASK_MIN_SCALE,
                start: MASK_MIN_SCALE,
                to: MASK_MAX_SCALE
            }

            this.tweens.add({
                delay: 595,
                duration: 550,
                scaleX: propertyConfig,
                scaleY: propertyConfig,
                targets: this.mask
            })
        })

        this.events.on(Phaser.Scenes.Events.TRANSITION_OUT, () => {
            const propertyConfig = {
                ease: 'Expo.easeInOut',
                from: MASK_MAX_SCALE,
                start: MASK_MAX_SCALE,
                to: MASK_MIN_SCALE
            }

            this.tweens.add({
                duration: 350,
                scaleX: propertyConfig,
                scaleY: propertyConfig,
                targets:this.mask
            })
        } )
    }
}