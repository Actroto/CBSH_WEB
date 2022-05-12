// --------------- [ get 요소 가져오는 함수 ] ------------------ //
// 파라메터 정보가 저장될 오브젝트
// https://stove99.tistory.com/97
var getParam = function(key){
    var _parammap = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }
        
        _parammap[decode(arguments[1])] = decode(arguments[2]);
    });
    return _parammap[key];
};
// alert("sport_id : " + getParam("sport"));

const sport_id = getParam("sport");

// --------------- [ firebase와 연결 과정] ------------------ //
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

// --------------- [ 테이블 생성 과정 ] ------------------ //

var backBtn = document.getElementById("backSport");
var nextBtn = document.getElementById("nextSport");
var backN = 0, nextN = 0;

var table_title = document.getElementById("table-title");
var sport_exist = false;
var sport_hangul = "";
for(var i =0; i<sport_event_list.length;i++){
    if(sport_id == sport_event_list[i]){
        backN = i-1
        nextN = i+1
        if(i==0){ backN = sport_event_list.length-1; }
        if(i==sport_event_list.length-1){ nextN = 0 }
        sport_exist = true;
        sport_hangul = sport_event_list_hangul[i];
        break;
    }
}
table_title.innerText = sport_hangul+" 경기 로그";
backBtn.setAttribute("href",document.location["href"].replace(sport_id,sport_event_list[parseInt(backN)]));
nextBtn.setAttribute("href",document.location["href"].replace(sport_id,sport_event_list[parseInt(nextN)]));

const log_table = document.getElementById("table-body-log");

const starCountRef = ref(db, "Sportday_log/"+sport_id);
onValue(starCountRef, (snapshot) => {
    if(snapshot.exists()){
        // DB 데이터 받아오기
        const data = snapshot.val();
        for(var key=data.length-1;key>=0; key--){
            var tr = document.createElement("tr");
            tr.setAttribute("class","log-tr");
            const starCountRef2 = ref(db, "Sportday_log/"+sport_id+'/'+key);
            onValue(starCountRef2, (snapshot) => {
                if(snapshot.exists()){
                    // DB 데이터 받아오기
                    const data = snapshot.val();
                    var vic = data["vic_gc"];
                    var def = data["def_gc"];
                    var match = data["match"];
                    var vic_th = document.createElement("th");
                    vic_th.setAttribute("id","victory_class");
                    vic_th.innerText = vic[0]+'-'+vic[1];
                    var def_th = document.createElement("th");
                    def_th.setAttribute("id","defeated_class");
                    def_th.innerText = def[0]+'-'+def[1];
                    var match_th = document.createElement("th");
                    match_th.innerText = match;
                    tr.append(vic_th, def_th, match_th);
                }
            });
            log_table.append(tr);
            var logNum = document.getElementsByClassName("log-tr").length;
            if(logNum > data.length){
                window.location.reload();
            }
        }
    }
});