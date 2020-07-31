import Phaser from '../lib/phaser.js'

export default class shadowParticle extends Phaser.GameObjects.Particles.Particle{
    constructor (emitter){
        super(emitter)

        this.t = 0
        this.i = 0
        // console.log(`Emitter Keys >> ${Object.keys(this.emitter)}`)
        console.log(`Emitter Keys >> ${this.origin}`)
    }

    update (delta, step, processors){
        let result = super.update(delta, step, processors)

        // this.t += delta


        // if (this.t >= anim.msPerFrame)
        // {
        //     this.i++;

        //     if (this.i > 17)
        //     {
        //         this.i = 0;
        //     }

        //     this.frame = anim.frames[this.i].frame;

        //     this.t -= anim.msPerFrame;
        // }

        return result
    }
}