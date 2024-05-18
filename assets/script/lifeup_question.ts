import Global from "./global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {
    @property(cc.SpriteFrame)
    normalBlockSprite: cc.SpriteFrame = null;  // Sprite for the normal block

    start() {
        // Ensure the lifeup mushroom is initially inactive
        this.node.getChildByName("lifeup").active = false;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "player" && contact.getWorldManifold().normal.y < 0) {
            this.transformToNormalBlock();
            this.showMushroom();
        }
    }

    transformToNormalBlock() {
        let sprite = this.getComponent(cc.Sprite);
        if (sprite && this.normalBlockSprite) {
            sprite.spriteFrame = this.normalBlockSprite;
        }
    }

    showMushroom() {
        let lifeup = this.node.getChildByName("lifeup");
        if (lifeup) {
            // Set the mushroom to be active
            lifeup.active = true;

            // Set the initial position of the mushroom to be on top of the block
            lifeup.setPosition(0, this.node.height / 2 + lifeup.height / 2);

            // Optionally, you can add a slight animation to the mushroom if needed
            let moveUp = cc.moveBy(0.5, cc.v2(0, lifeup.height / 2)).easing(cc.easeCubicActionOut());
            lifeup.runAction(moveUp);
        }
    }
}
