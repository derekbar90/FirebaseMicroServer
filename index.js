var admin = require("firebase-admin");
var http = require('http');


var serviceAccount = require("./internet-of-stan-firebase-adminsdk-dcl0a-57b5cf1c5b.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://internet-of-stan.firebaseio.com",
    databaseAuthVariableOverride: {
        uid: "feeder"
    }
});

var db = admin.database();
var ref = db.ref("feeder");

var openAction = ref.child("open");
var rotateTo = ref.child("rotation");

openAction.set(false).then(function(){
    openAction.on("value", function(snapshot) {
        var changedPost = snapshot.val();
        console.log("The updated post title is " + changedPost);
        if(changedPost){
            http.get("http://10.0.0.31/1a1bc3/feedTheBeast?=''", function(resp){
                openAction.set(false)
            })
        }
    });
});


rotateTo.set(0).then(function(){
    rotateTo.on("value", function(snapshot) {
        var degree = snapshot.val();
        console.log("Rotating to " + degree );
        if(degree < 180 && degree > 0){
            http.get("http://10.0.0.31/1a1bc3/rotateTo?=" + degree, function(resp){
                console.log('done')
            })
        }
    });
})