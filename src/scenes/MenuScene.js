import { CST } from "../CST";
export class MenuScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.MENU
        })
    }

    init(data){
        console.log(data);
        console.log("Got it! Welcome!");
        console.log("Keep Parcel as Server");
    }

    preload(){

    }

    create(){

    }
}