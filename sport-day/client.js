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

// 아래 형태로 열 제목 생성
// <th id="class">학년-반</th>
// <th id="soccer">축구</th>
// <th id="dodge-ball">피구</th>
// ...
// <th id="total">총점</th>
const title_board = document.getElementById("title_board_row");
for(var i=0;i<sport_event_list.length;i++){
    var sport_id = sport_event_list[i]
    var th = document.createElement("th");
    th.setAttribute("id",sport_id);
    var a = document.createElement("a");
    a.setAttribute("id",sport_id);
    a.setAttribute("href","howItGoing.html?sport="+sport_id);
    a.setAttribute("style","text-decoration:none;color:black;");
    a.innerHTML = sport_event_list_hangul[i];
    title_board.append(th);
    th.append(a);
}
var th = document.createElement("th");
th.setAttribute("id","total");
th.innerHTML = "총점";
title_board.append(th);

// 아래 형태로 각 한년-반 행을 추가
// <tr id="1-1-class">
//     <th id="1-1">1-1</th>
//     <th id="basketball">농구</th>
//     <th id="pingpong">탁구</th>
//     <th id="total">총점</th>
// </tr>
const score_board = document.getElementById("score_board");

for(var z=0;z<class_list.length; z++){
    const grade = class_list[z][0];
    const classN = class_list[z][1];
    // 데이터 베이스에서 데이터 불러오기
    const dbref = ref(db);
    const starCountRef = ref(db, "ClassData/"+grade+classN);
    onValue(starCountRef, (snapshot) => {
        // DB 데이터 받아오기
        const data = snapshot.val();
        // 학년-반 행 생성  
        var class_tr = document.createElement("tr");
        class_tr.setAttribute("id",grade+"-"+classN+"class");
        score_board.append(class_tr);
        // 학년-반 칸 생성
        const class_th = document.createElement("th");
        class_th.setAttribute("id",grade+'-'+classN);
        class_th.setAttribute("class","grade-class");
        // class_th.innerHTML = grade+"-"+classN
        class_tr.append(class_th);
        // 종목 당 점수 칸 생성
        var total_score = 0;
        for(var i=0; i<sport_event_list.length;i++){
            var sport_id = sport_event_list[i];
            var score_th = document.createElement("th");
            score_th.setAttribute("id",sport_id);
            score_th.innerHTML=data[sport_id];
            total_score += Number(data[sport_id]);
            class_tr.append(score_th);
        }
        var total_th = document.createElement("th");
        total_th.setAttribute("id","total");
        total_th.innerHTML = total_score;
        class_tr.append(total_th);
        // 학년-반 이름 바꾸기
        var class_tags = document.getElementsByClassName("grade-class");
        if(class_tags.length > class_list.length){
            window.location.reload();
        }
        for(var i=0;i<class_tags.length;i++){
            var class_tag = class_tags.item(i);
            // var classN = (i%3)+1;
            // var grade = parseInt(i/3)+1;
            var grade = class_list[i][0];
            var classN = class_list[i][1];
            var classNameStr = String(grade)+'-'+String(classN);
            class_tag.innerText  = classNameStr;
            class_tag.id = grade+'-'+classN;
        }
    });
}