const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {
    @property(cc.Node)
    player: cc.Node = null;

    @property
    smoothTime: number = 0.2; // 控制相機跟隨的平滑時間

    @property
    minX: number = 0; 
    @property
    maxX: number = 3000; 
    @property
    minY: number = 0; 
    @property
    maxY: number = 0 

    update(dt) {
        if (this.player) {
            let targetPos = this.player.position;
            let cameraPos = this.node.position;

            let newX = cc.misc.lerp(cameraPos.x, targetPos.x, this.smoothTime);
            let newY = cc.misc.lerp(cameraPos.y, targetPos.y, this.smoothTime);

            newX = cc.misc.clampf(newX, this.minX, this.maxX);
            newY = cc.misc.clampf(newY, this.minY, this.maxY);

            this.node.position = new cc.Vec2(newX, newY);
        }
    }
}
