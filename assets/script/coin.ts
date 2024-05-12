// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Global from "./global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start () {

    }

    // update (dt) {}
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === 'player') {
            this.node.destroy();
            Global.coin++;
        }
    }
}
