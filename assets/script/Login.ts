const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.EditBox)
    email: cc.EditBox = null;

    @property(cc.EditBox)
    password: cc.EditBox = null;

    start() {
        let enter_btn = new cc.Component.EventHandler();
        enter_btn.target = this.node;
        enter_btn.component = "Login";
        enter_btn.handler = "login";
        cc.find("Canvas/Main Camera/sprite/enter_btn")
            .getComponent(cc.Button)
            .clickEvents.push(enter_btn);

        let cancel_btn = new cc.Component.EventHandler();
        cancel_btn.target = this.node;
        cancel_btn.component = "Login";
        cancel_btn.handler = "loadStartScene";
        cc.find("Canvas/Main Camera/sprite/cancel_btn")
            .getComponent(cc.Button)
            .clickEvents.push(cancel_btn);
    }

    login() {
        firebase.auth()
            .signInWithEmailAndPassword(this.email.string, this.password.string)
            .then((res) => {
                cc.director.loadScene("loading");
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    loadStartScene() {
        cc.director.loadScene("Menu");
    }
}
