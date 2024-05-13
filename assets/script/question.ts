const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {
    @property(cc.SpriteFrame)
    normalBlockSprite: cc.SpriteFrame = null;  // Sprite for the normal block

    start(){
        let coin=this.node.getChildByName("coin");
        coin.setScale(0,0);
    }
    // Called every time when this component begins to contact a collider in another body.
    onBeginContact(contact, selfCollider, otherCollider) {
        // Check if the collider is the player and the collision is from below
        if (otherCollider.node.name === "player" && contact.getWorldManifold().normal.y < 0) {
            this.transformToNormalBlock();
            let coin=this.node.getChildByName("coin");
            coin.setScale(1,1);
            let action=cc.sequence(
                cc.moveBy(0.1, 0, 30).easing(cc.easeInOut(1)),
                cc.moveBy(0.1, 0, -30).easing(cc.easeInOut(1)),
                cc.delayTime(0.05),
                cc.callFunc(()=>{
                    coin.destroy();
                })
            );
            coin.runAction(action);
            console.log("coin");

        }
    }

    transformToNormalBlock() {
        let sprite = this.getComponent(cc.Sprite);
        if (sprite && this.normalBlockSprite) {
            sprite.spriteFrame = this.normalBlockSprite;  // Change the sprite to the normal block
        }
    }
    // update (dt) {}
}
