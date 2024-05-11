// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;
    
    @property(cc.Node)
    player: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.audioEngine.playMusic(this.bgm, true);
        let physicManager=cc.director.getPhysicsManager();
        physicManager.enabled=true;
    }

    start () {
        
    }

    update (dt) 
    {

    }
}
