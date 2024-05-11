const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    email: cc.EditBox = null;

    @property(cc.EditBox)
    password: cc.EditBox = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        firebase.auth().signinWithEmailAndPassword(this.email.string, this.password.string)
        .then((user) => {
            console.log("User created successfully");
            cc.director.loadScene("LevelSelect");
        }
        ).catch((error) => {
            console.log(error);
        });
    }

    // update (dt) {}
}
