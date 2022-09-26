// - - - - - - - [firebase와 연결 과정] - - - - - - - - - - - - //
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

import {getDatabase, ref, get, set, child, update, remove, onValue}
from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";

const db = getDatabase();

// - - - - - - - [head line] - - - - - - - - - - - - //
// print the nickname
var member_name = document.getElementById("member-name");
member_name.innerText=code;

// - - - - - - - [input lotto code] - - - - - - - - - - - - //
// simple settings
var p = document.getElementById("p-range");
p.textContent = "Range : "+ltto_min+"~"+ltto_max;
var inputs = document.getElementsByClassName("ltto-input");
for(var i=0;i<inputs.length;i++){
    var input = inputs[i];
    input.value=ltto_min;
    input.min=ltto_min;
    input.max=ltto_max;
}

// check if the secret-code is available
var scrt_bool_text = document.getElementById("scrt-bool");
var scrt_text = document.getElementById("secret-code");
var check_bttn = document.getElementById("scrt-code-check-bttn");
var scrt_code;
function checkUsableCode(){
    scrt_code = scrt_text.value;
    const dbref = ref(db);
    var cnt = 0;
    get(child(dbref,"Lotto/code/")).then((snapshot)=>{
        if(snapshot.exists()){
            cnt = snapshot.val()[scrt_code]
            if(cnt>0){
                scrt_bool_text.innerText = "usable";
                scrt_bool_text.style.color = "green";
            }else{
                scrt_bool_text.innerText = "unusable";
                scrt_bool_text.style.color = "red ";
            }
        }
        else{
            // alert("No Data found")
        }
    })
    .catch((error)=>{
        alert("Unsuccessful, erro"+error);
    });
}
check_bttn.addEventListener('click',checkUsableCode);

// random lotto

function getRandomInt(min, max) {
    // 출처 : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
var rand_bttn = document.getElementById("ltto-rand-bttn");
rand_bttn.addEventListener('click', function(){
    var inputs = document.getElementsByClassName("ltto-input");
    for(var i=0;i<inputs.length;i++){
        var input = inputs[i];
        input.value=getRandomInt(ltto_min, ltto_max+1);
    }
})

// make lotto
var make_bttn = document.getElementById("ltto-make-bttn");
function makeLotto(){
    // check the scrt code one more
    scrt_code = scrt_text.value;
    // check the range
    var inputs = document.getElementsByClassName("ltto-input");
    for(var i=0;i<inputs.length;i++){
        var input = inputs[i];
        if(input.value > ltto_max || input.value < ltto_min){
            alert("Out of Range");
            return;
        }
    }
    // work with db
    const dbref = ref(db);
    var cnt = 0;
    get(child(dbref,"Lotto/code/")).then((snapshot)=>{
        if(snapshot.exists()){
            cnt = snapshot.val()[scrt_code]
            if(cnt>0){ // if code can be used
                const dbref = ref(db);
                get(child(dbref,"Lotto/member/"+code+"/"+scrt_code)).then((snapshot)=>{
                    if(snapshot.exists()){
                        // already scrt_code is in user of code
                        alert("You already use this code")
                    }
                    else{
                        // make lotto
                        var make_code = "";
                        var inputs = document.getElementsByClassName("ltto-input");
                        for(var i=0;i<inputs.length;i++){
                            var input = inputs[i];
                            make_code += input.value+"-";
                        }
                        make_code = make_code.substring(0,make_code.length-1) // 맨 뒤 '-' 자르기
                        set(ref(db,"Lotto/member/"+code+"/"+scrt_code),make_code)
                        .then(()=>{
                            alert("data stored successfully");
                        })
                        .catch((error)=>{
                            alert("unsuccessful, error"+error);
                        });
                        // make code use count -1
                        set(ref(db,"Lotto/code/"+scrt_code),cnt-1)
                        .then(()=>{
                            // alert("data stored successfully");
                        })
                        .catch((error)=>{
                            alert("unsuccessful, error"+error);
                        });
                    }
                })
                .catch((error)=>{
                    alert("Unsuccessful, erro"+error);
                });
            }else{ // if code can't be used
                scrt_bool_text.innerText = "unusable";
                scrt_bool_text.style.color = "red ";
                alert("Please check the secret code again");
            }
            scrt_bool_text.innerText = "unusable";
            scrt_bool_text.style.color = "red";
            scrt_text.value = "";
        }
        else{
            // alert("No Data found")
        }
    })
    .catch((error)=>{
        alert("Unsuccessful, erro"+error);
    });
}
make_bttn.addEventListener('click',makeLotto)


// - - - - - - - [my lotto code] - - - - - - - - - - - - //
// read lottos of user
var ltto_check_bttn = document.getElementById("ltto-check-bttn");
function readlotto(){
    // alert("Sorry!\nPlease Wait.");
    const dbref = ref(db);
    get(child(dbref,"Lotto/member/"+code)).then((snapshot)=>{
        if(snapshot.exists()){
            var user_lottos = snapshot.val();
            // make rows as lottos
            for(var user_scrt_code in user_lottos){
                var user_lotto = user_lottos[user_scrt_code];
                var user_lotto_vals = user_lotto.split('-');
                // make html tag
                var tbody = document.getElementById("ltto-tbody");
                // delete old row
                var del_tr_list = document.getElementsByClassName("in-tbody");
                for(var j=del_tr_list.length-1; j>=0; j--){
                    del_tr_list[j].remove()
                }
                // create new row
                var tr = document.createElement("tr");
                tr.setAttribute("class","in-tbody");
                for(var j=0; j<user_lotto_vals.length; j++){
                    var td = document.createElement("td");
                    td.innerText = user_lotto_vals[j];
                    tr.append(td);
                }
                tbody.append(tr);
            }
        }
        else{
            alert("No Data found")
        }
    })
    .catch((error)=>{
        alert("Unsuccessful, erro"+error);
    });
}
ltto_check_bttn.addEventListener("click", readlotto);