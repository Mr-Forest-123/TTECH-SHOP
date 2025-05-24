import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOOQwq7E_oRT1fQkohW3PP1zKqNb7ItKU",
    authDomain: "donbosco-proyect.firebaseapp.com",
    projectId: "donbosco-proyect",
    storageBucket: "donbosco-proyect.firebasestorage.app",
    messagingSenderId: "598295956959",
    appId: "1:598295956959:web:428b5f7f8b88e381f6886a"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    console.log(user);
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("loggedUserFName").innerText =
            userData.firstName;
          document.getElementById("loggedUserEmail").innerText = userData.email;
          document.getElementById("loggedUserLName").innerText =
            userData.lastName;
        } else {
          console.log("no document found matching id");
        }
      })
      .catch((error) => {
        console.log("Error getting document");
      });
  } else {
    console.log("User Id not Found in Local storage");
  }
});

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error Signing out:", error);
    });
});
