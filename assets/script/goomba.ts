

const { ccclass, property } = cc._decorator;

@ccclass
export default class Goomba extends cc.Component {
    @property(cc.Number)
    walkDir: number = 1;

    @property(cc.Number)
    movingDir: number = 1;

    @property(cc.Number)
    movingSpeed: number = 5000;

    @property(cc.Node)
    goombaScore: cc.Node = null;

    private _animation: cc.Animation = null;
    private _isDie: boolean = false;
    private _onGround: boolean = false;
    public isFlew: boolean = false;

    onLoad() {
        this._animation = this.getComponent(cc.Animation);
    }

    start() {
        this.schedule(this.moving, 0.5);
        this.goombaScore.setScale(cc.v2(0, 0));
    }

    moving() {
        this.walkDir = -this.walkDir;
        this.node.setScale(cc.v2(this.walkDir * 2, 2));
    }

    update(dt: number) {
        if (this._onGround) {
            const rigidBody = this.getComponent(cc.RigidBody);
            rigidBody.linearVelocity = cc.v2(
                this.movingDir * this.movingSpeed * dt,
                rigidBody.linearVelocity.y
            );
        }

        if (this._isDie) {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.3);
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "player") {
            this.handlePlayerContact(contact, otherCollider);
        } else if (otherCollider.node.name === "pile" || otherCollider.node.getParent().name === "bound") {
            this.movingDir = -this.movingDir;
        } else if (otherCollider.tag === 2) {
            this._onGround = true;
        }
    }

    onPreSolve(contact, selfCollider, otherCollider) {
        if (otherCollider.tag === 2 && otherCollider.node.name !== "pile") {
            this._onGround = true;
        }
    }

    private handlePlayerContact(contact, otherCollider) {
        const player = otherCollider.node.getComponent("player");
        if (this._isDie) {
            contact.disabled = true;
        } else if (contact.getWorldManifold().normal.y > 0 && !this._isDie && !player.is_die) {
            this.killGoomba(contact, player);
        } else if (!this._isDie && this.node.active) {
            player.playerDie();
        }
    }

    private killGoomba(contact, player) {
        this._animation.play("goomba_kill");
        this.unschedule(this.moving);
        player.is_onGround = true;
        player.playerJump();
        contact.disabled = true;

        this._isDie = true;
        this.goombaScore.setScale(cc.v2(1 * this.walkDir, 1));

        this.scheduleOnce(() => {
            this.goombaScore.destroy();
        }, 0.5);

        cc.find("GameMgr").getComponent("gameMgr").get_score(100);
    }
}
