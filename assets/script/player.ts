const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    @property
    speed: number = 100; // Speed at which the player moves, units per second
    
    @property
    jumpHeight: number = 300; // Jump height of the player, units  

    private moveDirection: number = 0;
    private isOnGround: boolean = false;
    private isJumping: boolean = false;
    private isSpaceDown: boolean = false;
    private anim: cc.Animation = null;
    private moveAnimState: cc.AnimationState = null;
    private jumpAnimState: cc.AnimationState = null;
    private dieAnimState: cc.AnimationState = null; 
    private idleAnimState: cc.AnimationState = null;    
    private AnimState: cc.AnimationState = null;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.AnimState=this.getComponent(cc.Animation).play("player_idle");
        this.moveAnimState = this.getComponent(cc.Animation).getAnimationState("player_move");
        this.jumpAnimState = this.getComponent(cc.Animation).getAnimationState("player_jump");
        this.dieAnimState = this.getComponent(cc.Animation).getAnimationState("player_die");
        this.idleAnimState = this.getComponent(cc.Animation).getAnimationState("player_idle");
    }

    

    update(dt) {
        // Check if the player is trying to move and ensure there is no wall in the move direction
        if (this.moveDirection !== 0) {
            this.node.x += this.moveDirection * this.speed * dt;
    
            if (!this.anim.getAnimationState("player_move").isPlaying) {
                this.anim.play("player_move");
            }
        } else {
            // Play idle animation if not moving
            if (!this.anim.getAnimationState("player_idle").isPlaying) {
                this.anim.play("player_idle");
            }
        }
    }
    
    canMoveTo(xPosition) {
        // Here, you'll need to implement a way to check if the position `xPosition` is clear of walls
        // For now, let's assume you have some logic to check collisions or wall proximity:
        // Return false if there is a wall, true if movement is possible
        return true;  // Placeholder: Replace this with actual collision check logic
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
        if(otherCollider.node.name === "left_bound" || otherCollider.node.name === "right_bound"){ 
            this.moveDirection = 0;
        }
        else if (otherCollider.tag === 2) {
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

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
