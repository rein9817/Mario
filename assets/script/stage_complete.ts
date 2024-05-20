import Global from "./global";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    
    start() {
        if (!Global.complete1) {
            this.node.active = false;
        }
    }
}
