import Global from "./global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    goomba_score: cc.Node = null;

    private isDead: boolean = false;
    private onGround: boolean = false;
    private movingDirection: number = 1;
    private movingSpeed: number = 3000;
    private animation: cc.Animation = null;
    private _animState: cc.AnimationState = null;  // Declare the _animState property

    onLoad() {
        this.animation = this.getComponent(cc.Animation);
    }

    start() {
        this.schedule(() => {   
            this.movingDirection = -this.movingDirection;
            this.moving();
        }, 0.3);
        this.goomba_score.setScale(cc.v2(0, 0));
    }

    moving() {
        this.movingDirection = -this.movingDirection;
        this.node.setScale(cc.v2(this.movingDirection * 2, 2));
    }

    update(dt) {
        if (this.onGround) {
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.movingDirection * this.movingSpeed * dt, this.getComponent(cc.RigidBody).linearVelocity.y);
        }
        if (this.isDead) {
            this.scheduleOnce(() => {   
                this.node.destroy();
            }, 0.5);
        }
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        console.log(otherCollider.node.name);
        if (this.isDead) {
            contact.disabled = true;
            return;
        }
        if (otherCollider.node.name === "player") {
            if (contact.getWorldManifold().normal.y > 0 && !otherCollider.node.getComponent("player").is_die) {
                this._animState = this.animation.play("goomba_kill");
                this.unschedule(this.moving);
                otherCollider.node.getComponent("player").is_onGround = true;
                otherCollider.node.getComponent("player").playerJump();
                contact.disabled = true;
                this.isDead = true;
                this.goomba_score.setScale(cc.v2(1 * this.movingDirection, 1));

                this.scheduleOnce(function () {
                    this.goomba_score.destroy();
                }, 0.5);

                Global.score += 100;
            } else if (!this.isDead && this.node.active) {
                otherCollider.node.getComponent("player").playerDie();
            }
        } else if (otherCollider.node.getParent().name === "high_pile" || otherCollider.node.getParent().name === "bound") {
            this.movingDirection = -this.movingDirection;
        } else if (otherCollider.tag === 2) {
            this.onGround = true;
        }
    }

    
    
    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if(otherCollider.tag===2 && !(otherCollider.node.getParent().name==="pile") && !(otherCollider.node.getParent().name==="bound"))
        {
            this.onGround = true;
        }
    }
}
