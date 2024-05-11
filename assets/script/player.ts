const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    @property
    speed: number = 200; // Speed at which the player moves, units per second
    
    @property
    jumpHeight: number = 300; // Jump height of the player, units  

    moveDirection: number = 0;
    isOnGround: boolean = false;
    isJumping: boolean = false;
    isSpaceDown: boolean = false;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        console.log("Player loaded");
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt) {
        if (this.moveDirection !== 0) {
            this.node.x += this.moveDirection * this.speed * dt;
        }
    }

    jump() {
        if (this.isOnGround && !this.isJumping && this.isSpaceDown) {
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpHeight);
            this.isJumping = true;
            this.isOnGround = false; // Reset ground state until collision confirms it's back on ground
        }
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.space:
                this.isSpaceDown = true;
                this.jump();
                break;
            case cc.macro.KEY.a:
                this.moveDirection = -1;
                break;
            case cc.macro.KEY.d:
                this.moveDirection = 1;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.d:
                this.moveDirection = 0;
                break;
            case cc.macro.KEY.space:
                this.isJumping = false;
                this.isSpaceDown = false;
                break;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.tag === 2) {
            this.isOnGround = true;
        }
        else if(otherCollider.tag === 3) {
            cc.director.loadScene("gameover"); 
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.tag === 2) {
            this.isOnGround = false;
        }
    }
}
