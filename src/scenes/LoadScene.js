import { CST } from "../CST";
export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LOAD
        })
    }
    init(){
        console.log("hahahahha");
    }
    
    preload(){
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });
    }

    create(){
        this.scene.start(CST.SCENES.MENU, "Hello from Ababuuuu~~!");
    }


}