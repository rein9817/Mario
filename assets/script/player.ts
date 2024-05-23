const { ccclass, property } = cc._decorator;
import Global from "./global";

@ccclass
export default class Player extends cc.Component {
    @property(cc.Node)
    game_mgr: cc.Node = null;

    @property(cc.Boolean)
    is_inwater: cc.Boolean = false;

    @property()
    jumpspeed: number = 300;

    private _animation: cc.Animation = null;
    private _animState: cc.AnimationState = null;
    private _idleAnimState: cc.AnimationState = null;
    private _moveAnimState: cc.AnimationState = null;
    private _jumpAnimState: cc.AnimationState = null;
    private _dieAnimState: cc.AnimationState = null;
    private _swimAnimState: cc.AnimationState = null;
    private _swimupAnimState: cc.AnimationState = null;
    private idleFrame: cc.SpriteFrame = null;

    private is_player_move: boolean = false;
    private is_jump: boolean = false;
    private is_onGround: boolean = false;
    private is_die: boolean = false;

    private roburn_x: number = -465;

    private moveDir = 0;

    @property()
    playerSpeed: number = 100;

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);

        // Add event listeners for keyboard input
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;

        this._idleAnimState = this._animation.getAnimationState("player_idle");
        this._moveAnimState = this._animation.getAnimationState("player_move");
        this._jumpAnimState = this._animation.getAnimationState("player_jump");
        this._dieAnimState = this._animation.getAnimationState("player_die");
        this._swimAnimState = this._animation.getAnimationState("player_swim");

        if (this.is_inwater) {
            this._animState = this._animation.play("player_swim");
        } else {
            this._animState = this._animation.play("player_idle");
        }
    }

    update(dt) {
        this.node.x = this.node.x <= this.roburn_x ? this.roburn_x : this.node.x;

        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(
            this.moveDir * this.playerSpeed,
            this.getComponent(cc.RigidBody).linearVelocity.y
        );

        if (this.moveDir != 0) {
            this.node.setScale(new cc.Vec2(this.moveDir, 1));
        }

        if (!this.is_inwater) {
            this.handleLandAnimations();
        } else {
            this.handleWaterAnimations();
        }
    }

    handleLandAnimations() {
        if (!this.is_die) {
            if (
                !this.node.getComponent(cc.RigidBody).linearVelocity.fuzzyEquals(cc.Vec2.ZERO, 0.01) &&
                this.is_onGround
            ) {
                if (this._animState != this._moveAnimState) {
                    this._animState = this._animation.play("player_move");
                }
            } else if (
                !this.node.getComponent(cc.RigidBody).linearVelocity.fuzzyEquals(cc.Vec2.ZERO, 0.01)
            ) {
                if (this._animState != this._jumpAnimState) {
                    this._animState = this._animation.play("player_jump");
                }
            } else {
                if (this._animState != this._idleAnimState) {
                    this._animState = this._animation.play("player_idle");
                }
            }
        } else {
            if (this._animState != this._dieAnimState) {
                this._animState = this._animation.play("player_die");
            }
        }
    }

    handleWaterAnimations() {
        if (!this.is_die) {
            if (this.is_onGround && this._animState != this._moveAnimState) {
                this._animState = this._animation.play("player_move");
            } else if (!this.is_onGround &&this._animState != this._swimAnimState ) {
                this._animState = this._animation.play("player_swim");
            }
        } else {
            if (this._animState != this._dieAnimState) {
                this._animState = this._animation.play("player_die");
            }
        }
    }

    playerMove(moveDir: number) {
        this.moveDir = moveDir;
    }

    playerJump() {
        if (this.is_inwater) {
            this.is_onGround = false;
            this._animState = this._animation.play("player_swim_up");
            cc.find("gameMgr").getComponent("gameMgr").play_player_swim_sound();
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(
                this.getComponent(cc.RigidBody).linearVelocity.x,
                this.jumpspeed
            );
            this.scheduleOnce(function () {
                this._animState = this._animation.play("player_swim");
            }, 0.5);
        } else {
            if (this.is_onGround) {
                this.is_onGround = false;
                cc.find("gameMgr").getComponent("gameMgr").play_player_jump_sound();
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(
                    this.getComponent(cc.RigidBody).linearVelocity.x,
                    this.jumpspeed
                );
            }
        }
    }

    playerDie() {
        Global.life--;
        this.is_die = true;
        cc.find("gameMgr").getComponent("gameMgr").play_player_die_sound();
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
                    cc.director.loadScene("GameStart");
                })
            );
            this.node.runAction(seq);
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.is_die) {
            contact.disabled = true;
        } else {
            if (otherCollider.node.name == "lower_bound") {
                this.playerDie();
            } else if (
                otherCollider.tag == 2 &&
                contact.getWorldManifold().normal.y < 0
            ) {
                this.is_onGround = true;
                this._animState = this._animation.play("player_idle");
            } else if (otherCollider.node.name == "flag") {
                this.game_mgr.getComponent("gameMgr").game_complete();
            }
        }
    }

    onPreSolve(contact, selfCollider, otherCollider) {
        if (this.is_die) {
            contact.disabled = true;
        }
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.playerMove(-1);
                break;
            case cc.macro.KEY.right:
                this.playerMove(1);
                break;
            case cc.macro.KEY.up:
                this.playerJump();
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.playerMove(0);
                break;
        }
    }
}
