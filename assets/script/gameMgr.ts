import Global from "./global";
import Player from "./player";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component { 

    @property(cc.Node)
    player: cc.Node = null;

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

    private physicManager: cc.PhysicsManager = null;
    private time: number = 300;

    onLoad() {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        // this.physicManager.gravity = cc.v2(0, -200);
        
        // Check and initialize labels
        console.log("Initializing labels in onLoad");
        if (this.timer_label) {
            this.timer_label.string = this.time.toString();
        } else {
            console.error("timer_label is null");
        }

        if (this.life_label) {
            this.life_label.string = Global.life.toString();
        } else {
            console.error("life_label is null");
        }

        if (this.coin_label) {
            this.coin_label.string = Global.coin.toString();
        } else {
            console.error("coin_label is null");
        }

        if (this.score_label) {
            this.score_label.string = Global.score.toString();
        } else {
            console.error("score_label is null");
        }
    }

    start() {
        this.playBGM();
        if (this.life_label) {
            this.life_label.string = Global.life.toString();
        } else {
            console.error("life_label is null in start");
        }
        this.schedule(this.update_timer, 1);
    }

    update(dt) {
        if (!Global.score) {
            Global.score = 0;
            if (this.score_label) {
                this.score_label.string = Global.score.toString();
            }
        }

        if (!Global.coin) {
            Global.coin = 0;
            if (this.coin_label) {
                this.coin_label.string = Global.coin.toString();
            }
        }
    }

    update_timer() {
        if (this.time <= 0) {
            if (this.timer_label) {
                this.timer_label.string = "0";
            }
            this.player.getComponent(Player).playerDie();
        } else {
            this.time--;
            if (this.timer_label) {
                this.timer_label.string = this.time.toString();
            }
        }
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        let playerComp = this.player.getComponent(Player);
        switch (event.keyCode) {
            case cc.macro.KEY.a: // Left
                playerComp.playerMove(-1);
                break;
            case cc.macro.KEY.d: // Right
                playerComp.playerMove(1);
                break;
            case cc.macro.KEY.space: // Jump
                playerComp.playerJump();
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.a || event.keyCode === cc.macro.KEY.d) {
            this.player.getComponent(Player).playerMove(0);
        }
    }

    game_complete() {
        this.unschedule(this.update_timer);
        cc.audioEngine.playMusic(this.level_complete_sound, false);
        cc.systemEvent.off(
            cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown,
            this
        );
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        Global.complete1 = true;
        if (!Global.offline) {
            let seq = cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.game_complete_word
                        .getComponent("game_complete")
                        .show_word1();
                }),
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.game_complete_word
                        .getComponent("game_complete")
                        .show_word2();
                }),
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.game_complete_word
                        .getComponent("game_complete")
                        .show_score(this.time);
                    Global.score += this.time * 50;
                    if (this.score_label) {
                        this.score_label.string = Global.score.toString();
                    }
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
    }

    get_score(score: number) {
        Global.score += score;
        if (this.score_label) {
            this.score_label.string = Global.score.toString();
        }
    }

    get_lifeup() {
        cc.audioEngine.playEffect(this.player_lifeup_sound, false);
        Global.life++;
        if (this.life_label) {
            this.life_label.string = Global.life.toString();
        }
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
