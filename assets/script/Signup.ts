const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.EditBox)
    email: cc.EditBox = null;

    @property(cc.EditBox)
    username: cc.EditBox = null;

    @property(cc.EditBox)
    password: cc.EditBox = null;

    start() {
        let enter_btn = new cc.Component.EventHandler();
        enter_btn.target = this.node;
        enter_btn.component = "Signup";
        enter_btn.handler = "sign_up";
        cc.find("Canvas/Main Camera/sprite/enter_btn").getComponent(cc.Button).clickEvents.push(enter_btn);

        let cancel_btn = new cc.Component.EventHandler();
        cancel_btn.target = this.node;
        cancel_btn.component = "Signup";
        cancel_btn.handler = "loadStartScene";
        cc.find("Canvas/Main Camera/sprite/cancel_btn").getComponent(cc.Button).clickEvents.push(cancel_btn);
    }

    sign_up() {
        firebase
            .auth()
            .createUserWithEmailAndPassword(
                this.email.string,
                this.password.string
            )
            .then((res) => {
                if (res) {
                    var ref = firebase.database().ref("users/" + res.user.uid);
                    var data = {
                        username: this.username.string,
                        life: 5,
                        score: 0,
                        coin: 0,
                        max_score: 0,
                    };
                    ref.set(data).then(() => {
                        cc.director.loadScene("loading");
                    });
                }
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    loadStartScene() {
        cc.director.loadScene("Menu");
    }
}

