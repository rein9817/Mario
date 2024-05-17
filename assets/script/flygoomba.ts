const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    goomba: cc.Node = null;

    private isDie = false;
    private animation: cc.Animation = null;

    onLoad() {
        this.goomba.getComponent("goomba").is_flew = true;
        this.goomba.active = false;
        this.animation = this.getComponent(cc.Animation);
        this.animation.play("fly");
    }

    start() {
        const seq = cc.sequence(
            cc.moveBy(1, 0, 50).easing(cc.easeInOut(1)),
            cc.moveBy(1, 0, -50).easing(cc.easeInOut(1))
        );
        const repeatAction = cc.repeatForever(seq);
        this.node.runAction(repeatAction);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "player") {
            const playerComponent = otherCollider.node.getComponent("player");

            if (!playerComponent.is_die) {
                if (contact.getWorldManifold().normal.y > 0) {
                    playerComponent.playerJump();
                    this.goomba.active = true;
                    this.isDie = true;
                } else if (!this.isDie) {
                    playerComponent.playerDie();
                }
            }
        }
    }

    update(dt) {
        if (this.isDie) {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.3);
        } else {
            if (!this.animation.getAnimationState("fly").isPlaying) {
                this.animation.play("fly");
            }
        }
    }
}
