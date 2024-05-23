import Global from "./global";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelSelect extends cc.Component {
    @property(cc.Label)
    life_label: cc.Label = null;

    @property(cc.Label)
    coin_label: cc.Label = null;

    @property(cc.Label)
    score_label: cc.Label = null;

    @property(cc.Label)
    username_label: cc.Label = null;

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    start() {
        cc.audioEngine.playMusic(this.bgm, true);
        this.updateLabels();

        let stage1_btn = new cc.Component.EventHandler();
        stage1_btn.target = this.node;
        stage1_btn.component = "level_select"; // This should be the name of your class
        stage1_btn.handler = "LoadStage1";
        cc.find("Canvas/stage1")
            .getComponent(cc.Button)
            .clickEvents.push(stage1_btn);

        let stage2_btn = new cc.Component.EventHandler();
        stage2_btn.target = this.node;
        stage2_btn.component = "level_select"; // This should be the name of your class
        stage2_btn.handler = "LoadStage2";
        cc.find("Canvas/stage2")
            .getComponent(cc.Button)
            .clickEvents.push(stage2_btn);

        let leader_board_btn = new cc.Component.EventHandler();
        leader_board_btn.target = this.node;
        leader_board_btn.component = "level_select"; // This should be the name of your class
        leader_board_btn.handler = "LoadLeaderBoard";
        cc.find("Canvas/leader_board_btn")
            .getComponent(cc.Button)
            .clickEvents.push(leader_board_btn);
    }


    updateLabels() {
        this.life_label.string = (Global.life !== null && Global.life !== undefined) ? Global.life.toString() : "0";
        this.coin_label.string = (Global.coin !== null && Global.coin !== undefined) ? Global.coin.toString() : "0";
        this.score_label.string = (Global.score !== null && Global.score !== undefined) ? Global.score.toString() : "0";
        this.username_label.string = (Global.username !== null && Global.username !== undefined) ? Global.username : "";
        console.log(Global.username);
    }


    LoadStage1() {
        console.log("LoadStage1");
        Global.stage = "Level1";
        cc.director.loadScene("GameStart");
    }

    LoadStage2() {
        console.log("LoadStage2");
        Global.stage = "Level2"; // Assuming this was meant to be Level2
        cc.director.loadScene("GameStart");
    }

    LoadLeaderBoard() {
        var ref = firebase.database().ref("users/").orderByChild("max_score");
        ref.once("value").then((val) => {
            var data = [];
            val.forEach((element) => {
                console.log(element.val().username);
                console.log(element.val().max_score);
                data.push([element.val().username, element.val().max_score]);
            });
            data.reverse();
            Global.leader = data;
            cc.director.loadScene("LeaderBoard");
        });
    }
}
