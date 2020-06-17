import Phaser from '../lib/phaser.js'

export default class Menu extends Phaser.Scene{

    menuItemPos = 0
    menuItems = ['game', 'credits']
    /** @type {Phaser.GameObjects.Text} */
    menuText
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    constructor(){
        super('menu')
    }

    init(){
        this.sound.stopAll()
        this.menuItemPos = 0
    }

    preload(){
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(){
        // use ScaleManager to get with and height of game
        const width = this.scale.width
        const height = this.scale.height
        console.log('Main Menu')
        const style = { color: '#fff', fontSize: 24}
        this.add.text(width * 0.5, height * 0.1, 'Main Menu', style).setOrigin(0.5)
        
        this.menuText = this.add.text(width * 0.5, height * 0.5, `${this.menuItems[this.menuItemPos]}`, style).setOrigin(0.5)

        this.input.keyboard.once('keydown_ENTER', () => {
            this.scene.start(`${this.menuItems[this.menuItemPos]}`)
        })
    }

    update(){
        const isJustDown_Up = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        const isJustDown_Down = Phaser.Input.Keyboard.JustDown(this.cursors.down)

        if (isJustDown_Down){
            if (this.menuItemPos >= this.menuItems.length - 1){
                this.menuItemPos = 0
            }else {
                this.menuItemPos++
            }

            this.menuText.text = this.menuItems[this.menuItemPos]
            console.log(`CURRENT SCENE : ${this.menuItems[this.menuItemPos]}`)
        } else if (isJustDown_Up){
            if (this.menuItemPos <= 0){
                this.menuItemPos = this.menuItems.length - 1
            } else {
                this.menuItemPos--
            }

            this.menuText.text = this.menuItems[this.menuItemPos]
            console.log(`CURRENT SCENE : ${this.menuItems[this.menuItemPos]}`)
        }
    }
}