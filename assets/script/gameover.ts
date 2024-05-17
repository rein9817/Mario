import Global from "./global";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    onLoad() {
        const seq = cc.sequence(
            cc.delayTime(2),
            cc.callFunc(() => {
                cc.director.loadScene("LevelSelect");
                const user = firebase.auth().currentUser;
                if (user) {
                    const ref = firebase.database().ref("users/" + user.uid);
                    ref.update({
                        life: 5,
                        score: 0,
                        coin: Global.coin,
                        complete1: Global.complete1,
                        max_score: Global.max_score,
                    });
                }
                Global.life = 5;
            })
        );
        this.node.runAction(seq);
    }
    // update (dt) {}
}
