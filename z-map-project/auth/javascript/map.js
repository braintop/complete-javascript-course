// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
    getAuth,
    onAuthStateChanged,
    signOut,
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
    deleteDoc,
    getDocs,
    setDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let map;
let fullname = document.getElementById("fullname");
let address = document.getElementById("address");
let markers = [];
let mapEvent;

navigator.geolocation.getCurrentPosition(
    function (position) {
        console.log(position);
        let { latitude, longitude } = position.coords;
        let location = `https://www.google.com/maps/place/Israel/@${latitude},${longitude}`;
        console.log(location);
        document.getElementById("myLocation").href = location;
        map = L.map("map").setView([latitude, longitude], 13);
        L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        map.on("click", function (mapE) {
            mapEvent = mapE;
            const { lat, lng } = mapEvent.latlng;
            console.log(mapEvent.latlng);
            addMarker(lat, lng, fullname.value);
            close();
        });
        loadAllFromFS(); // Call the function to load users and add markers on the map
    },
    function () {
        alert("could not get your position");
    }
);
// Function to add a marker on the map
function addMarker(lat, lng, name) {
    const marker = L.marker([lat, lng]).addTo(map);
    const popupContent = document.createElement("div");
    const nameElement = document.createElement("p");
    nameElement.textContent = name;
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("green", "backGroundBlack"); // Add classes "a" and "b" to the delete button

    deleteBtn.textContent = "Delete";

    // Add click event listener to the delete button
    deleteBtn.addEventListener("click", () => {
        alert("are you sure you want to delete " + name);
        deleteMarker(marker);
    });
    popupContent.appendChild(nameElement);
    popupContent.appendChild(deleteBtn);
    marker.bindPopup(popupContent);
    marker.name = name; // Set the 'name' property for the marker

    markers.push({ marker, name }); // Store markers and names in an array
}
function close() {
    const mylist = document.getElementById("mylist");
    const listItem = document.createElement("li");
    const listLength = mylist.children.length + 1;
    const lastFullName = fullname.value;

    listItem.textContent = listLength + ":" + fullname.value; // Use the fullname value as the content of the list item
    mylist.appendChild(listItem);

    // Add click event listener to the newly added list item
    listItem.addEventListener("click", () => {
        const markerItem = markers.find((item) => item.name === lastFullName);
        if (!markerItem) {
            console.error("Marker not found for fullname:", fullname.value);
            return;
        }
        const { marker } = markerItem;
        map.panTo(marker.getLatLng());
        marker.openPopup();
    });

    // Add the new marker to the markers array
    addMarker(mapEvent.latlng.lat, mapEvent.latlng.lng, fullname.value);
    const data = {
        lat: mapEvent.latlng.lat,
        lang: mapEvent.latlng.lng,
        fullname: fullname.value,
    };
    console.log(data);
    setDoc(doc(db, "places", fullname.value), data)
        .then(() => {
            alert("data stored successfully");
        })
        .catch((err) => {
            alert("error: " + err);
        });

    fullname.value = "";
    address.value = "";
}
async function loadAllFromFS() {
    // Step 1: Fetch all documents from the "places" collection
    const placesRef = collection(db, "places");
    const placesSnapshot = await getDocs(placesRef);

    // Step 2: Add markers for each place in the collection
    placesSnapshot.forEach((doc) => {
        const { lat, lang, fullname } = doc.data();
        addMarker(lat, lang, fullname);
    });

    // Step 3: Display places in the list
    const mylist = document.getElementById("mylist");
    mylist.innerHTML = ""; // Clear the existing list

    placesSnapshot.forEach((doc) => {
        const { fullname } = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = fullname;
        listItem.style.cursor = "pointer";
        mylist.appendChild(listItem);
        // Add click event listener to each list item
        listItem.addEventListener("click", () => {
            const { marker } = markers.find((item) => item.name === fullname);
            map.panTo(marker.getLatLng());
            marker.openPopup();
        });
    });
}
function deleteMarker(marker) {
    map.removeLayer(marker);
    const index = markers.findIndex((item) => item.marker === marker);
    if (index !== -1) {
        markers.splice(index, 1);
        const name = marker.name;
        const placesRef = doc(db, "places", name);

        // Remove the corresponding document from Firestore
        deleteDoc(placesRef)
            .then(() => {
                console.log(
                    `Document "${name}" successfully deleted from Firestore.`
                );
                location.reload();
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
    }
}
window.logout = function () {
    signOut(auth)
        .then(function () {
            alert("Logout Successfully");
            window.location.href = "pages/login.html";
        })
        .catch(function (err) {
            console.log(err);
        });
};

function checkAuthentication() {
    onAuthStateChanged(auth, function (user) {
        if (user) {
            console.log("check2");
            const uid = user.uid;
            console.log(uid);
            // ...
        } else {
            // User is signed out
            // ...
            console.log("check3");

            window.location.href = "pages/login.html";
        }
        console.log("check4");
    });
}
checkAuthentication();
/*
גGo to the Firebase console: https://console.firebase.google.com/

Select your project (if you have multiple projects).

Click on "Authentication" in the left sidebar.

Navigate to the "Sign-in method" tab.

Scroll down to the "Authorized domains" section.

Click the "Add domain" button.

Enter "127.0.0.1" in the input field and click "Add".

npm = node package menager 
install nodejs 
sudo npm install -g http-server 
Save your changes.

if u want to run the server - http-server
*/
