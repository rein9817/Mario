import Global from "./global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    private moving_speed: number = 10000;

    @property(cc.Float)
    moving_dir: number = 1; 

    @property(cc.AudioClip)
    LifeUpSound: cc.AudioClip = null;

    start() {}

    update(dt) {
        let rigidBody = this.getComponent(cc.RigidBody);
        if (rigidBody) {
            rigidBody.linearVelocity = cc.v2(
                this.moving_dir * this.moving_speed * dt,
                rigidBody.linearVelocity.y
            );
        } else {
            console.error("RigidBody component is missing!");
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        console.log("Collided with: " + otherCollider.node.name);
        
        if (otherCollider.node.name == "player") {
            this.playLifeUpSound();
            this.node.destroy();
            cc.find("gameMgr").getComponent("gameMgr").get_lifeup();
        } else if (
            otherCollider.node.name == "pile" ||
            otherCollider.node.getParent().name == "bound" ||
            otherCollider.node.name == "block" ||
            otherCollider.node.name == "block copy"
        ) {
            console.log("Changing direction");
            this.moving_dir = -this.moving_dir;
        }
    }

    playLifeUpSound() {
        if (this.LifeUpSound) {
            cc.audioEngine.playEffect(this.LifeUpSound, false);
        } else {
            console.error("LifeUpSound not found");
        }
    }
}
