const { ccclass, property } = cc._decorator;

@ccclass
export default class FlowerMovement extends cc.Component {
    private _animation: cc.Animation = null;

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
        if (!this._animation) {
            console.error("Animation component not found on the node");
        }
    }

    start() {
        this.playFlowerAnimation();

        const moveUp = cc.moveBy(1, 0, 50).easing(cc.easeInOut(1));
        const moveDown = cc.moveBy(1, 0, -50).easing(cc.easeInOut(1));
        const delay = cc.delayTime(1);
        const seq = cc.sequence(moveUp, delay, moveDown, delay);

        const action = cc.repeatForever(seq);
        this.node.runAction(action);
    }

    playFlowerAnimation() {
        const animState = this._animation.play("flower");
        animState.wrapMode = cc.WrapMode.Loop; // Set animation to loop
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "player") {
            console.log("Player collided with flower");
            otherCollider.node.getComponent("player").playerDie();
            cc.director.loadScene("GameOver");
        }
    }
}
