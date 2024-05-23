const { ccclass, property } = cc._decorator;
import Global from "./global";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    a_label: cc.Label = null;

    @property(cc.Label)
    b_label: cc.Label = null;

    @property(cc.Label)
    c_label: cc.Label = null;

    @property(cc.Label)
    d_label: cc.Label = null;

    @property(cc.Label)
    e_label: cc.Label = null;

    start() {
        const labels = [
            this.a_label,
            this.b_label,
            this.c_label,
            this.d_label,
            this.e_label,
        ];

        let cancel_btn = new cc.Component.EventHandler();
        cancel_btn.target = this.node;
        cancel_btn.component = "leaderboard";
        cancel_btn.handler = "loadStartScene";

        cc.find("Canvas/Main Camera/sprite/cancel_btn")
            .getComponent(cc.Button)
            .clickEvents.push(cancel_btn);

        for (let i = 0; i < 5; i++) {
            if (i < Global.leader.length) {
                console.log(Global.leader[i][0].toUpperCase());
                labels[i].string = Global.leader[i][0].toUpperCase();
            }
        }
    }

    loadStartScene() {
        cc.director.loadScene("LevelSelect");
    }
    
}
