const { ccclass, property } = cc._decorator;

@ccclass
export default class Game_complete extends cc.Component {
    @property(cc.Label)
    word1: cc.Label = null;

    @property(cc.Label)
    word2: cc.Label = null;

    @property(cc.Label)
    time_label: cc.Label = null;

    @property(cc.Label)
    score_label: cc.Label = null;

    @property(cc.Node)
    time_node: cc.Node = null;

    onLoad() {
        this.time_node.setScale(cc.v2(0, 0));
    }

    show_word1() {
        this.word1.string = "GAME";
    }

    show_word2() {
        this.word2.string = "COMPLETE";
    }

    show_score(time: number) {
        this.time_node.setScale(cc.v2(1, 1));
        this.time_label.string = time.toString();
        this.score_label.string = (time * 50).toString();
    }
}
