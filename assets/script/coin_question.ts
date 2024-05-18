import Global from "./global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {
    @property(cc.SpriteFrame)
    normalBlockSprite: cc.SpriteFrame = null;  // Sprite for the normal block

    @property(cc.AudioClip)
    coinSound: cc.AudioClip = null;

    start() {
        let coin = this.node.getChildByName("coin");
        if (coin) {
            coin.setScale(0, 0);
        } else {
            console.error("Coin node not found");
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {

        if (otherCollider.node.name === "player" && contact.getWorldManifold().normal.y < 0) {
            this.transformToNormalBlock();
            let coin = this.node.getChildByName("coin");
            if (coin) {
                coin.setScale(1, 1);
                let action = cc.sequence(
                    cc.moveBy(0.1, 0, 30).easing(cc.easeInOut(1)),
                    cc.moveBy(0.1, 0, -30).easing(cc.easeInOut(1)),
                    cc.delayTime(0.05),
                    cc.callFunc(() => {
                        coin.destroy();
                    })
                );

                // Ensure the node and its rigid body are valid
                let rigidBody = this.node.getComponent(cc.RigidBody);
                if (rigidBody && rigidBody.enabled) {
                    coin.runAction(action);
                    this.playCoinSound(); // Play coin sound effect
                    Global.coin++; // Increment coin count
                    console.log(Global.coin);
                } else {
                    console.error("RigidBody not found or not enabled on node");
                }
            } else {
                console.error("Coin node not found");
            }
        }
    }

    transformToNormalBlock() {
        let sprite = this.getComponent(cc.Sprite);
        if (sprite && this.normalBlockSprite) {
            sprite.spriteFrame = this.normalBlockSprite;
        }
    }

    playCoinSound() {
        if (this.coinSound) {
            cc.audioEngine.playEffect(this.coinSound, false);
            console.log("Coin sound played");
        } else {
            console.error("Coin sound not found");
        }
    }
}
