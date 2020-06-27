import Phaser from './lib/phaser.js'

import Menu from './scenes/Menu.js'
import Game from './scenes/Game.js'
import GameOver from './scenes/GameOver.js'
import Credits from './scenes/Credits.js'
import Pause from './scenes/Pause.js'
import Options from './scenes/Options.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    pixelArt: true,
    scene: [Menu, Game, GameOver, Credits, Pause, Options],
    physics: {
        default: 'arcade',
        arcade: {
            
            debug: true
        },
    },
    backgroundColor: '#243338'
})

console.log('VERTIGRIND DEVELOPMENT STATUS: ONLINE');