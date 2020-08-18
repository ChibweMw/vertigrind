import Phaser from '../lib/phaser.js'
import GameOptions from '../GameOptions.js'

// import SceneTransition from './Transitions.js'

export default class Menu extends Phaser.Scene{
// export default class Menu extends SceneTransition{

    menuItemPos = 0
    menuItems = ['game']
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
        GameOptions.inGameScene = false
    }

    preload(){
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(){
        // super.create()
        // use ScaleManager to get with and height of game
        const width = this.scale.width
        const height = this.scale.height
        console.log('Main Menu')
        const style = { color: '#fff', fontSize: 24}
        // this.add.text(width * 0.5, height * 0.1, 'Main Menu', style).setOrigin(0.5)
        
        // this.add.bitmapText(width * 0.5, height * 0.1, 'classified', 'VertiGrind', 64).setOrigin(0.5)

        const gameLogo = this.add.image(width / 2, height * 0.05, 'logo',).setScale(2).setOrigin(0.5, 0)
        

        // this.menuText = this.add.bitmapText(width * 0.5, height * 0.5, 'classified', `${this.menuItems[this.menuItemPos]}`, 24).setOrigin(0.5)
        this.menuText = this.add.bitmapText(width * 0.5, height * 0.5, 'classified')
        // config menu text
        this.menuText.setMaxWidth(200)
        this.menuText.setOrigin(0.5)
        this.menuText.setFontSize(32)
        this.menuText.setText(`Press SPACE`)

        this.tweens.add({
            targets: this.menuText,
            alpha: { from: 1, to: 0.1 },
            duration: 470,
            ease: 'Cubic.easeInOut',
            yoyo: true,
            repeat: -1,
        })

        console.log(`CURRENT Selected SCENE : ${this.menuItems[this.menuItemPos]}`)
        this.scene.launch('game')
        this.scene.moveDown('game')

        
    }

    update(){
        const isJustDown_Space = Phaser.Input.Keyboard.JustUp(this.cursors.space)

        if (isJustDown_Space){
            // this.scene.get('game').spawnPlatform()
            GameOptions.inGameScene = true
            this.scene.stop()
        }
    }

    
}