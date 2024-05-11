
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
        console.log(this.email.string);
        console.log(this.password.string);
        firebase.auth().createUserWithEmailAndPassword(this.email.string, this.password.string)
        .then((user) => {
            console.log("User created successfully");
            cc.director.loadScene("Login");
        }
        ).catch((error) => {
            console.log(error);
        });
    }

    // update (dt) {}
}
