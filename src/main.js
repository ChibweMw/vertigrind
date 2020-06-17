import Phaser from './lib/phaser.js'

import Menu from './scenes/Menu.js'
import Game from './scenes/Game.js'
import GameOver from './scenes/GameOver.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    pixelArt: true,
    scene: [Menu, Game, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 2000
            },
            debug: true
        },
    },
    backgroundColor: 'rgba(68, 136, 170, 0.5)'
})

console.log('VERTIGRIND DEVELOPMENT STATUS: ONLINE');