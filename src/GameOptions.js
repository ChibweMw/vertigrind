// global game options
let gameOptions
export default gameOptions = {
    platformStartSpeed: 15,
    platformMaxSpeed: 60,
    platformSpeedLevel: [10, 0, 50],
    curveLevel: [0.25, 0.5, 0.65],
    platformSizeRange: [2, 5],
    playerGravity: 2000,
    playerJumpForce: 800,
    playerJumpCount: 2,
    isDebug: false,
    isGameStart: false,
    currentGameScore: 0,
    levelDifficulty: [75, 300, 750]
}