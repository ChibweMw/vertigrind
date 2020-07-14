import Phaser from './lib/phaser.js'

import GameOptions from './GameOptions.js'

import Menu from './scenes/Menu.js'
import Game from './scenes/Game.js'
import GameOver from './scenes/GameOver.js'
import Credits from './scenes/Credits.js'
import Pause from './scenes/Pause.js'
import Transition from './scenes/Transitions.js'
import Options from './scenes/Options.js'


export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    pixelArt: true,
    scene: [Menu, Game, GameOver, Credits, Pause, Transition, Options],
    physics: {
        default: 'arcade',
        arcade: {
            
            debug: false, //GameOptions.isDebug,
            fps: 60,
            // debugBodyColor: 0xff00f7,
        },
    },
    backgroundColor:   '#61b7ac' // '#4B0082' - purple '#000000' - black, '#30303d' - grey '0xede4da' - white '#61b7ac' neon blue
})

console.log('VERTIGRIND DEVELOPMENT STATUS: ONLINE');