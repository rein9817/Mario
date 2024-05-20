import Global from "./global";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property()
    jumpspeed: number = 300;

    @property(cc.AudioClip)
    game_over_sound: cc.AudioClip = null;
    
    private _animation: cc.Animation = null;
    private _animState: cc.AnimationState = null;
    private _idleAnimState: cc.AnimationState = null;
    private _moveAnimState: cc.AnimationState = null;
    private _jumpAnimState: cc.AnimationState = null;
    private _dieAnimState: cc.AnimationState = null;
    private is_onGround: boolean = false;
    private is_die: boolean = false;

    private moveDir = 0;

    @property()
    playerSpeed: number = 100;

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        this._idleAnimState = this._animation.getAnimationState("player_idle");
        this._moveAnimState = this._animation.getAnimationState("player_move");
        this._jumpAnimState = this._animation.getAnimationState("player_jump");
        this._dieAnimState = this._animation.getAnimationState("player_die");
        this._animState = this._animation.play("player_idle");
    }

    update(dt) {
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(
            this.moveDir * this.playerSpeed,
            this.getComponent(cc.RigidBody).linearVelocity.y
        );

        if (this.moveDir !== 0) {
            this.node.setScale(new cc.Vec2(this.moveDir, 1));
        }

        if (!this.is_die) {
            const velocity = this.getComponent(cc.RigidBody).linearVelocity;
            if (!velocity.fuzzyEquals(cc.Vec2.ZERO, 0.01) && this.is_onGround) {
                if (this._animState !== this._moveAnimState) {
                    this._animState = this._animation.play("player_move");
                }
            } else if (!velocity.fuzzyEquals(cc.Vec2.ZERO, 0.01)) {
                if (this._animState !== this._jumpAnimState) {
                    this._animState = this._animation.play("player_jump");
                }
            } else {
                if (this._animState !== this._idleAnimState) {
                    this._animState = this._animation.play("player_idle");
                }
            }
        } else {
            if (this._animState !== this._dieAnimState) {
                this._animState = this._animation.play("player_die");
            }
        }
    }

    playerMove(moveDir: number) {
        this.moveDir = moveDir;
    }

    playerJump() {
        if (this.is_onGround) {
            this.is_onGround = false;
            cc.find("gameMgr").getComponent("gameMgr").play_player_jump_sound();
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.getComponent(cc.RigidBody).linearVelocity.x,this.jumpspeed);
        }
    }

    playerDie() {
        Global.life--;
        this.is_die = true;
        cc.audioEngine.playEffect(this.game_over_sound, false);

        if (Global.life < 0) {
            let seq = cc.sequence(
                cc.callFunc(() => {
                    this.playerJump();
                    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
                    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
                }),
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    cc.director.loadScene("GameOver");
                })
            );
            this.node.runAction(seq);
        } else {
            let seq = cc.sequence(
                cc.callFunc(() => {
                    this.playerJump();
                    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
                    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
                }),
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    cc.director.loadScene("game_start");
                })
            );
            this.node.runAction(seq);
        }
    }   

    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.is_die) {
            contact.disabled = true;
        } else {
            if (otherCollider.node.name === "lower_bound") {
                this.playerDie();
                cc.audioEngine.playEffect(this.game_over_sound, false);
            } else if (otherCollider.tag === 2 && contact.getWorldManifold().normal.y < 0) {
                this.is_onGround = true;
            } else if (otherCollider.node.name === "flag") {
                console.log("game complete");
                cc.find("gameMgr").getComponent("gameMgr").game_complete();
            }
        }
    }

    onPreSolve(contact, selfCollider, otherCollider) {
        if (this.is_die) {
            contact.disabled = true;
        }
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.playerMove(-1);
                break;
            case cc.macro.KEY.d:
                this.playerMove(1);
                break;
            case cc.macro.KEY.space:
                this.playerJump();
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.a || event.keyCode === cc.macro.KEY.d) {
            this.playerMove(0);
        }
    }
}
