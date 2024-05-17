
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;
    


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.audioEngine.playMusic(this.bgm, true);
        let physicManager=cc.director.getPhysicsManager();
        physicManager.enabled=true;
        // console.log("onLoad");
    }

    start () {
        
    }

    update (dt) 
    {

    }

    gameComplete()
    {
        
    }
}
