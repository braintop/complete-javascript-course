// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
    getAuth,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Your web app's Firebase configuration
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
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    setDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//getting reference to html object
var firstname = document.getElementById("firstname");
var lastname = document.getElementById("lastname");
var email = document.getElementById("email");
var password = document.getElementById("password");
window.signup = function () {
    //e.preventDefault();
    if (
        firstname.value == "" ||
        lastname.value == "" ||
        email.value == "" ||
        password.value == ""
    ) {
        alert("All Field Are Required");
        return;
    }

    let obj = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        password: password.value,
    };
    console.log(obj);
    createUserWithEmailAndPassword(auth, obj.email, obj.password)
        .then(function (success) {
            alert("sign up success");
        })
        .catch(function (err) {
            alert("error:" + err);
        });
    console.log(obj);
};
