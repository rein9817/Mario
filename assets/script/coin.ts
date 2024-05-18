import Global from "./global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // start () {

    // }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === 'player') {
            this.node.destroy();
            Global.coin++;
            console.log(Global.coin);
            cc.find("gameMgr").getComponent("gameMgr").get_coin();
            // console.log("coin collected");
        }
    }
}
