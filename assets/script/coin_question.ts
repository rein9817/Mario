import Global from "./global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {
    @property(cc.SpriteFrame)
    normalBlockSprite: cc.SpriteFrame = null;

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
                    this.playCoinSound(); 
                    cc.find("gameMgr").getComponent("gameMgr").get_coin();
                } else {
                    console.error("RigidBody not found or not enabled on node");
                }
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
        cc.audioEngine.playEffect(this.coinSound, false);
    }
}
