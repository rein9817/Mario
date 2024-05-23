import Player from "./player";
import Global from "./global";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {
    @property(Player)
    player: Player = null;

    @property(cc.Label)
    life_label: cc.Label = null;

    @property(cc.Label)
    timer_label: cc.Label = null;

    @property(cc.Label)
    coin_label: cc.Label = null;

    @property(cc.Label)
    score_label: cc.Label = null;

    @property(cc.Node)
    flag: cc.Node = null;

    @property(cc.Node)
    game_complete_word: cc.Node = null;

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    @property(cc.AudioClip)
    player_jump_sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    player_die_sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    get_coin_sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    player_lifeup_sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    level_complete_sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    player_swim_sound: cc.AudioClip = null;

    private leftDown: boolean = false;
    private rightDown: boolean = false;
    private physicManager: cc.PhysicsManager = null;
    private time: number = 300;

    onLoad() {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.physicManager.gravity = cc.v2(0, -200);

        this.timer_label.string = this.time.toString();
        this.life_label.string = Global.life.toString();
        this.coin_label.string = Global.coin.toString();
        this.score_label.string = Global.score.toString();
    }

    start() {
        this.playBGM();
        this.life_label.string = Global.life.toString();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.schedule(this.update_timer, 1);
    }

    update(dt) {
        if (Global.score == null) {
            Global.score = 0;
            this.score_label.string = Global.score.toString();
        }

        if (Global.coin == null) {
            Global.coin = 0;
            this.coin_label.string = Global.coin.toString();
        }
    }

    update_timer() {
        if (this.time <= 0) {
            this.timer_label.string = "0";
            this.player.playerDie();
        } else {
            this.time--;
            this.timer_label.string = this.time.toString();
        }
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.player.playerMove(-1);
                break;
            case cc.macro.KEY.right:
                this.player.playerMove(1);
                break;
            case cc.macro.KEY.up:
                this.player.playerJump();
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.player.playerMove(0);
                break;
        }
    }

    game_complete() {
        this.unschedule(this.update_timer);
        cc.audioEngine.playMusic(this.level_complete_sound, false);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        Global.complete1 = true;
        const seq = cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                this.game_complete_word.getComponent("game_complete").show_word1();
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.game_complete_word.getComponent("game_complete").show_word2();
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.game_complete_word.getComponent("game_complete").show_score(this.time);
                Global.score += this.time * 50;
                this.score_label.string = Global.score.toString();
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                let user = firebase.auth().currentUser;
                if (user) {
                    var ref = firebase.database().ref("users/" + user.uid);
                    ref.update({
                        coin: Global.coin,
                        score: Global.score,
                        max_score: Math.max(Global.score, Global.max_score),
                        complete1: Global.complete1,
                        life: Global.life
                    });
                }
                cc.director.loadScene("LevelSelect");
            })
        );
        this.node.runAction(seq);
    }

    get_coin() {
        Global.coin++;
        this.coin_label.string = Global.coin.toString();
        cc.audioEngine.playEffect(this.get_coin_sound, false);
    }

    get_score(score: number) {
        Global.score += score;
        this.score_label.string = Global.score.toString();
    }

    get_lifeup() {
        Global.life++;
        this.life_label.string = Global.life.toString();
        cc.audioEngine.playEffect(this.player_lifeup_sound, false);
    }

    playBGM() {
        cc.audioEngine.playMusic(this.bgm, true);
    }

    play_player_jump_sound() {
        cc.audioEngine.playEffect(this.player_jump_sound, false);
    }

    play_player_swim_sound() {
        cc.audioEngine.playEffect(this.player_swim_sound, false);
    }

    play_player_die_sound() {
        cc.audioEngine.playEffect(this.player_die_sound, false);
    }
}
