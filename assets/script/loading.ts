import Global from "./global";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    start() {
        const user = firebase.auth().currentUser;
        if (user) {
            const ref = firebase.database().ref("users/" + user.uid);
            ref.on("value", (snapshot) => {
                const val = snapshot.val();
                if (val) {
                    Global.coin = val.coin || 0;
                    Global.username = val.username ? val.username.toUpperCase() : "UNKNOWN";
                    Global.life = val.life || 3;
                    Global.score = val.score || 0;
                    Global.max_score = val.max_score || 0;
                    Global.complete1 = val.complete1 || false;
                    cc.director.loadScene("LevelSelect");
                } else {
                    console.error("No data available for the user.");
                }
            }, (error) => {
                console.error("Error fetching user data: ", error);
            });
        } else {
            console.error("No user is currently signed in.");
        }
    }
}
