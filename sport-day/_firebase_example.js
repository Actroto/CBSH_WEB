// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3DnmTequ_CF45mcUQ3xEa_FElJ6Ooa8Q",
  authDomain: "cbsh-student.firebaseapp.com",
  databaseURL: "https://cbsh-student-default-rtdb.firebaseio.com",
  projectId: "cbsh-student",
  storageBucket: "cbsh-student.appspot.com",
  messagingSenderId: "626143323152",
  appId: "1:626143323152:web:400f8c99476b3f2485d695",
  measurementId: "G-XZ7VMJE2J0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import {getDatabase, ref, get, set, child, update, remove}
from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";

const db = getDatabase();

// ---------------[define] --------------------------------- //
var namebox = document.getElementById("Namebox")
var rollbox = document.getElementById("Rollbox")
var secbox = document.getElementById("Secbox");
var genbox = document.getElementById("Genbox");

var insBtn = document.getElementById("Insbtn")
var selBtn = document.getElementById("Selbtn")
var updBtn = document.getElementById("Updbtn")
var delBtn = document.getElementById("Delbtn")

// -------------[insert data function] -------------------------- //

function InsertData(){
    set(ref(db,"TheStudents/"+rollbox.value),{
        NameOfStd: namebox.value,
        RollNo: rollbox.value,
        Section: secbox.value,
        Gender: genbox.value
    })
    .then(()=>{
        alert("data stored successfully");
    })
    .catch((error)=>{
        alert("unsuccessful, error"+error);
    });
}

// ------------[Select Data function]--------------------------- //
function SelectData(){
    const dbref = ref(db);
    get(child(dbref,"TheStudents/"+rollbox.value)).then((snapshot)=>{
        if(snapshot.exists()){
            namebox.value = snapshot.val().NameOfStd;
            secbox.value = snapshot.val().Section;
            genbox.value = snapshot.val().Gender;
        }
        else{
            alert("No Data found")
        }
    })
    .catch((error)=>{
        alert("Unsuccessful, erro"+error);
    });
}

// ------------[Update Data function]--------------------------- //

function UpdateData(){
    set(ref(db,"TheStudents/"+rollbox.value),{
        NameOfStd: namebox.value,
        Section: secbox.value,
        Gender: genbox.value
    })
    .then(()=>{
        alert("data updated successfully");
    })
    .catch((error)=>{
        alert("unsuccessful, error"+error);
    });
}
// ------------[Delete Data function]--------------------------- //

function DeleteData(){
    remove(ref(db,"TheStudents/"+rollbox.value))
    .then(()=>{
        alert("data removed successfully");
    })
    .catch((error)=>{
        alert("unsuccessful, error"+error);
    });
}
// ------------[Assign Events To Btns]------------------------ //
insBtn.addEventListener('click',InsertData);
selBtn.addEventListener('click',SelectData);
updBtn.addEventListener('click',UpdateData);
delBtn.addEventListener('click',DeleteData);