import Global from "./global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Goomba extends cc.Component {
    @property(cc.Integer)
    walkDir: number = 1;

    @property(cc.Integer)
    movingDir: number = 1;

    @property(cc.Float)
    movingSpeed: number = 100;

    @property(cc.Node)
    goombaScore: cc.Node = null;

    private animation: cc.Animation = null;

    private isDie: boolean = false;

    private onGround: boolean = false;

    public isFlew: boolean = false;

    onLoad() {
        this.animation = this.getComponent(cc.Animation);
    }

    start() {
        this.schedule(this.move, 0.5);
        this.goombaScore.setScale(cc.v2(0, 0));
    }

    move = () => {
        this.walkDir = -this.walkDir;
        this.node.scaleX = this.walkDir * Math.abs(this.node.scaleX);
    }

    update(dt: number) {
        if (this.onGround && !this.isDie) {
            const rigidBody = this.getComponent(cc.RigidBody);
            rigidBody.linearVelocity = cc.v2(
                this.walkDir * this.movingSpeed*dt,
                rigidBody.linearVelocity.y
            );
        }

        if (this.isDie) {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.3);
        }
    }

    onBeginContact(contact: any, selfCollider: any, otherCollider: any) {
        if (otherCollider.node.name === "player") {
            if (this.isDie) {
                contact.disabled = true;
                return;
            }

            const playerComponent = otherCollider.node.getComponent("player");

            if (contact.getWorldManifold().normal.y > 0 && !this.isDie && !playerComponent.isDie) {
                this.animation.play("goomba_kill");
                this.unschedule(this.move);
                playerComponent.isOnGround = true;
                playerComponent.playerJump();
                contact.disabled = true;

                this.isDie = true;
                this.goombaScore.setScale(cc.v2(this.walkDir, 1));

                this.scheduleOnce(() => {
                    this.goombaScore.destroy();
                }, 0.5);

                Global.score += 100;
            } else if (!this.isDie && this.node.active) {
                playerComponent.playerDie();
            }
        } else if (["pile", "bound"].includes(otherCollider.node.getParent().name)) {
            this.movingDir = -this.movingDir;
            this.walkDir = -this.walkDir;
            this.node.scaleX = this.walkDir * Math.abs(this.node.scaleX); // 反转 Goomba 的方向
        } else if (otherCollider.tag === 2) {
            this.onGround = true;
        }
    }

    onPreSolve(contact: any, selfCollider: any, otherCollider: any) {
        if (otherCollider.tag === 2 || otherCollider.node.getParent().name === "pile") {
            this.onGround = true;
        }
    }
}
