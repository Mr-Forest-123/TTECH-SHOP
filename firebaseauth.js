import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6u9Xp-_XHBOD-p5T6OR87CjcBpwP5H0o",
  authDomain: "ttech-shop.firebaseapp.com",
  projectId: "ttech-shop",
  storageBucket: "ttech-shop.firebasestorage.app",
  messagingSenderId: "200212054285",
  appId: "1:200212054285:web:96aad7abd806eae7577044",
};

const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}
const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
      showMessage("Account Created Successfully", "signUpMessage");
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        showMessage("Email Address Already Exists !!!", "signUpMessage");
      } else {
        showMessage("unable to create User", "signUpMessage");
      }
    });
});

const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("login is successful", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "homepage.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMessage("Incorrect Email or Password", "signInMessage");
      } else {
        showMessage("Account does not Exist", "signInMessage");
      }
    });
});

const signInGmail = document.getElementById("submitGoogleLogin");
signInGmail.addEventListener("click", (event) => {
  event.preventDefault();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((userCredential) => {
      showMessage("login is successful", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "homepage.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMessage("Incorrect Email or Password", "signInMessage");
      } else {
        showMessage("Account does not Exist", "signInMessage");
      }
    });
});

const signInFacebook = document.getElementById("submitFacebookLogin");
signInFacebook.addEventListener("click", (event) => {
  event.preventDefault();
  const auth = getAuth(app);
  const provider = new FacebookAuthProvider();

  signInWithPopup(auth, provider)
    .then((userCredential) => {
      const user = userCredential.user;
      const additionalInfo = getAdditionalUserInfo(userCredential);
      
      if (
        additionalInfo.isNewUser === false &&
        additionalInfo.profile &&
        userCredential._tokenResponse.needConfirmation
      ) {
        showMessage(
          "Ya existe una cuenta con este correo electrónico registrada con otro proveedor. Por favor, inicia sesión con ese proveedor o vincula las cuentas.",
          "signInMessage"
        );
        return;
      }

      console.log("Login exitoso:", user);
      localStorage.setItem("loggedInUserId", user.uid);
      showMessage("login is successful", "signInMessage");
      setTimeout(() => {
        window.location.href = "homepage.html";
      }, 1000);
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMessage("Incorrect Email or Password", "signInMessage");
      } else {
        showMessage("Account does not Exist", "signInMessage");
      }
    });
});
