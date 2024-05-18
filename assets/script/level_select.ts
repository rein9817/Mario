import Global from "./global";
const { ccclass, property } = cc._decorator;



@ccclass
export default class level_select extends cc.Component {
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
        //console.log(Global.coin);
        cc.audioEngine.playMusic(this.bgm, true);
        this.life_label.string =Global.life.toString();
        this.coin_label.string = Global.coin.toString();
        this.score_label.string = Global.score.toString();
        this.username_label.string = Global.username;

        let stage1_btn = new cc.Component.EventHandler();
        stage1_btn.target = this.node;
        stage1_btn.component = "LevelSelect";
        stage1_btn.handler = "LoadStage1";
        cc.find("Canvas/stage1")
            .getComponent(cc.Button)
            .clickEvents.push(stage1_btn);

        let stage2_btn = new cc.Component.EventHandler();
        stage2_btn.target = this.node;
        stage2_btn.component = "LevelSelect";
        stage2_btn.handler = "LoadStage2";
        cc.find("Canvas/stage2")
            .getComponent(cc.Button)
            .clickEvents.push(stage2_btn);

        // let leader_board_btn = new cc.Component.EventHandler();
        // leader_board_btn.target = this.node;
        // leader_board_btn.component = "le";
        // leader_board_btn.handler = "Loadleader_board";
        // cc.find("Canvas/leader_board_btn")
        //     .getComponent(cc.Button)
        //     .clickEvents.push(leader_board_btn);
    }

    LoadStage1() {
        Global.stage ="Level1";
        cc.director.loadScene("GameStart");
    }

    LoadStage2() {
        Global.stage ="Level1";
        cc.director.loadScene("GameStart");
    }

    Loadleader_board() {
        var ref = firebase.database().ref("user/").orderByChild("max_score");
        ref.once("value").then((val) => {
            var data = [];
            val.forEach((element) => {
                console.log(element.val().username);
                console.log(element.val().max_score);
                data.push([element.val().username, element.val().max_score]);
            });
            // console.log(data);
            data.reverse();
            Global.leader = data;
            cc.director.loadScene("leader_board");
        });
    }

}
