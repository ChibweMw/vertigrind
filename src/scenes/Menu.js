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
        this.load.bitmapFont('babyblocks', 'assets/fonts/babyblocks.png', 'assets/fonts/babyblocks.xml')
    }

    create(){
        // use ScaleManager to get with and height of game
        const width = this.scale.width
        const height = this.scale.height
        console.log('Main Menu')
        const style = { color: '#fff', fontSize: 24}
        // this.add.text(width * 0.5, height * 0.1, 'Main Menu', style).setOrigin(0.5)
        
        this.add.bitmapText(width * 0.5, height * 0.1, 'babyblocks', 'Main Menu', 32).setOrigin(0.5)

        // this.menuText = this.add.bitmapText(width * 0.5, height * 0.5, 'babyblocks', `${this.menuItems[this.menuItemPos]}`, 24).setOrigin(0.5)
        this.menuText = this.add.bitmapText(width * 0.5, height * 0.5, 'babyblocks')
        this.menuText.setMaxWidth(100)
        this.menuText.setOrigin(0.5)
        this.menuText.setFontSize(24)
        this.menuText.setText(this.menuItems)


        
        
        // this.menuItems.forEach(menuItem => {
        //     this.menuText.text += `${menuItem} `
        //     console.log(`IN LOOP : ${menuItem}`)
        // })
        
        // console.log(`TypeOf Menu Items : ${typeof(this.menuText.text[0])}`)
        console.log(`TypeOf Menu Items : ${this.menuText.text}`)

        this.input.keyboard.once('keydown_ENTER', () => {
            this.scene.start(`${this.menuItems[this.menuItemPos].replace('> ', '')}`)
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
        } else if (isJustDown_Up){
            if (this.menuItemPos <= 0){
                this.menuItemPos = this.menuItems.length - 1
            } else {
                this.menuItemPos--
            }            
        }
        // display items
        this.menuItems.forEach((menutextItem, index) => {
            if (menutextItem == this.menuItems[this.menuItemPos] && menutextItem[0] !== '>'){
                this.menuItems[this.menuItemPos] = `> ` + menutextItem
            } else if (menutextItem !== this.menuItems[this.menuItemPos] && menutextItem[0] == '>'){
                console.log(`remove arrow at index : ${index} for word : ${this.menuItems[index].replace('> ', '')}`)
                this.menuItems[index] = menutextItem.replace('> ', '')
            }
        }) 
        
        console.log(`CURRENT Selected SCENE : ${this.menuItems[this.menuItemPos]}`)
        this.menuText.text = this.menuItems

    }

    
}