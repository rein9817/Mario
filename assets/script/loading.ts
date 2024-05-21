import Global from "./global";
const { ccclass, property } = cc._decorator;

// Initialize Global variables
Global.coin = 0;
Global.life = 5;
Global.score = 0;
Global.max_score = 0;
Global.complete1 = false;
Global.username = null;

@ccclass
export default class NewClass extends cc.Component {
    start() {
        // Retrieve user data from local storage
        let userData = JSON.parse(cc.sys.localStorage.getItem("userData"));

        if (!userData) {
            userData = {
                coin: 0,
                life: 5,
                score: 0,
                max_score: 0,
                complete1: false,
                username: Global.username,
            };
            cc.sys.localStorage.setItem("userData", JSON.stringify(userData));
        }

        Global.coin = userData.coin;
        Global.life = userData.life;
        Global.score = userData.score;
        Global.max_score = userData.max_score;
        Global.complete1 = userData.complete1;
        Global.username = userData.username;

        cc.director.loadScene("LevelSelect");
    }
}
