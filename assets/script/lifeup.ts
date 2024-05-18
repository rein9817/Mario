import Global from "./global";

const { ccclass, property } = cc._decorator; 
@ccclass
export default class NewClass extends cc.Component {
    private moving_speed: number = 10000;

    @property(cc.number)
    moving_dir: number = 1; 

    @property(cc.AudioClip)
    LifeUpSound: cc.AudioClip = null;

    start() {
        // this.getComponent(cc.PhysicsBoxCollider).sensorEnabled = true;
    }
    update(dt) {
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(
            this.moving_dir * this.moving_speed * dt,
            this.getComponent(cc.RigidBody).linearVelocity.y
        );
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        //console.log(otherCollider.node.name);

        if (otherCollider.node.name == "player") {
            this.playLifeUpSound();
            this.node.destroy();
            Global.life++;
            console.log(Global.life);
        } else if (otherCollider.node.name == "pile" ||otherCollider.node.getParent().name == "bound") {
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
