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

    }

    create(){
        this.scene.start(CST.SCENES.MENU, "Hello from Ababuuuu~~!");
    }


}