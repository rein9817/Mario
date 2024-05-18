
const { ccclass, property } = cc._decorator;


@ccclass
export default class NewClass extends cc.Component {
    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    start() {
        let log_in_btn = new cc.Component.EventHandler();
        log_in_btn.target = this.node;
        log_in_btn.component = "Menu";
        log_in_btn.handler = "loadLoginScene";
        cc.find("Canvas/LoginButton")
            .getComponent(cc.Button)
            .clickEvents.push(log_in_btn);
        let sign_up_btn = new cc.Component.EventHandler();
        sign_up_btn.target = this.node;
        sign_up_btn.component = "Menu";
        sign_up_btn.handler = "loadSignupScene";
        cc.find("Canvas/RegisterButton")
            .getComponent(cc.Button)
            .clickEvents.push(sign_up_btn);
        cc.audioEngine.playMusic(this.bgm, true);
    }

    loadLoginScene() {
        cc.director.loadScene("Login");
    }

    loadSignupScene() {
        cc.director.loadScene("Signup");
    }
}