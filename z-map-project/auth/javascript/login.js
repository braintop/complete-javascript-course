// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAaBBi53M431kzUe1a4OR2so70iKhTkXWs",
    authDomain: "mytest1-be63d.firebaseapp.com",
    databaseURL: "https://mytest1-be63d-default-rtdb.firebaseio.com",
    projectId: "mytest1-be63d",
    storageBucket: "mytest1-be63d.appspot.com",
    messagingSenderId: "285663144087",
    appId: "1:285663144087:web:446c91664e213b3a56a1d2",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

var email = document.getElementById("email");
var password = document.getElementById("password");
window.login = function (e) {
    e.preventDefault();
    var obj = {
        email: email.value,
        password: password.value,
    };

    signInWithEmailAndPassword(auth, obj.email, obj.password)
        .then(function (success) {
            alert("logined Successfully");
            var uid = success.user.uid;
            localStorage.setItem("uid", uid);
            console.log(uid);
            window.location.replace("../main.html");
            // localStorage.setItem(success,user,uid)
        })
        .catch(function (err) {
            alert("login error" + err);
        });

    console.log(obj);
};
