import Global from "./global";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property(cc.Node)
    game_mgr: cc.Node = null;

    @property()
    is_inwater: boolean = false;

    @property()
    jumpspeed: number = 300;

    private _animation: cc.Animation = null;
    private _animState: cc.AnimationState = null;
    private _idleAnimState: cc.AnimationState = null;
    private _moveAnimState: cc.AnimationState = null;
    private _jumpAnimState: cc.AnimationState = null;
    private _dieAnimState: cc.AnimationState = null;
    private _swimAnimState: cc.AnimationState = null;
    private idleFrame: cc.SpriteFrame = null;

    private is_onGround: boolean = false;
    private is_die: boolean = false;

    private moveDir = cc.v2(0, 0);

    @property()
    playerSpeed: number = 100;

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
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

        this.updateAnimationState();
    }

    update(dt) {
        let velocity = this.moveDir.mul(this.playerSpeed);
        if (this.is_inwater) {
            velocity = cc.v2(this.moveDir.x * this.playerSpeed, this.moveDir.y * this.playerSpeed);
        }
        this.getComponent(cc.RigidBody).linearVelocity = velocity;

        if (this.moveDir.x !== 0) {
            this.node.setScale(new cc.Vec2(Math.sign(this.moveDir.x), 1));
        }

        this.updateAnimationState();
    }

    updateAnimationState() {
        if (this.is_die) {
            if (this._animState !== this._dieAnimState) {
                this._animState = this._animation.play("player_die");
            }
        } else if (this.is_inwater) {
            if (this._animState !== this._swimAnimState) {
                this._animState = this._animation.play("player_swim");
            }
        } else {
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
        }
    }

    playerMove(moveDir: cc.Vec2) {
        this.moveDir = moveDir;
    }

    playerJump() {
        if (!this.is_inwater && this.is_onGround) {
            this.is_onGround = false;
            cc.find("GameMgr").getComponent("gameMgr").play_player_jump_sound();
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.getComponent(cc.RigidBody).linearVelocity.x, this.jumpspeed);
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
                    cc.director.loadScene("game_over");
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
            } else if (otherCollider.tag === 2 && contact.getWorldManifold().normal.y < 0) {
                this.is_onGround = true;
            } else if (otherCollider.node.name === "flag") {
                this.game_mgr.getComponent("gameMgr").game_complete();
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
                this.playerMove(cc.v2(-1, this.moveDir.y));
                break;
            case cc.macro.KEY.d:
                this.playerMove(cc.v2(1, this.moveDir.y));
                break;
            case cc.macro.KEY.w:
                if (this.is_inwater) {
                    this.playerMove(cc.v2(this.moveDir.x, 1));
                }
                break;
            case cc.macro.KEY.space:
                if(!this.is_inwater)
                {
                    this.playerJump();
                }
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.d:
                this.playerMove(cc.v2(0, this.moveDir.y));
                break;
            case cc.macro.KEY.w:
                if (this.is_inwater) {
                    this.playerMove(cc.v2(this.moveDir.x, 0));
                }
                break;
        }
    }
}
