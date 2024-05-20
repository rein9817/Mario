import Global from "./global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === 'player') {
            this.node.destroy();
            cc.find("gameMgr").getComponent("gameMgr").get_coin();
        }
    }
}
