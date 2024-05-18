import Global from "./global";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameStart extends cc.Component {
    onLoad() {
        // Create a sequence action: wait for 2 seconds, then call a function
        let seq = cc.sequence(
            cc.delayTime(2),
            cc.callFunc(this.startGame, this)
        );
        this.node.runAction(seq);
    }

    startGame() {
        // Load the next scene from Global variables
        cc.director.loadScene(Global.stage);
        
        // Get the current authenticated user
        let user = firebase.auth().currentUser;
        if (user) {
            // Reference to the user's data in Firebase
            let ref = firebase.database().ref("users/" + user.uid);
            // Update user data in Firebase
            ref.update({
                coin: Global.coin,
                score: Global.score,
                max_score: Global.max_score,
                complete1: Global.complete1,
                life: Global.life
            });
        }
    }
}
