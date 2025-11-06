// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyA9j7WMa0cJKyJMLrPXgUKr8x7NtQgiKlA",
  authDomain: "manitto-app.firebaseapp.com",
  databaseURL: "https://manitto-app-default-rtdb.firebaseio.com",
  projectId: "manitto-app",
  storageBucket: "manitto-app.firebasestorage.app",
  messagingSenderId: "12221910829",
  appId: "1:12221910829:web:2c4f9537cb3d4aeb3dcda4",
  measurementId: "G-X26S4VWTV6"
};

// Firebase 초기화
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 정답표 (사회자만 아는 데이터)
const manittoMap = {
  "민우": "주하",
  "주하": "기원",
  "기원": "유진",
  "유진": "민우"
};

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submitBtn");
  const msg = document.getElementById("msg");
  const myNameSelect = document.getElementById("myName");
  const guessSelect = document.getElementById("guess");

  // 전체 인원 리스트
  const allNames = ["민우", "주하", "기원", "유진"];

  // ✅ [1] 오늘 이미 제출했는지 확인
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const lastSubmit = localStorage.getItem("lastSubmitDate");

  if (lastSubmit === today) {
    btn.disabled = true;
    msg.innerText = "📅 오늘은 이미 제출했슈.";
    msg.style.color = "gray";
  }

  // ✅ [2] 내 이름 선택 시, 마니또 후보에서 자기 이름 제외
  myNameSelect.addEventListener("change", () => {
    const selected = myNameSelect.value;
    guessSelect.innerHTML = `<option value="">-- 선택 --</option>`;
    allNames
      .filter(name => name !== selected)
      .forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        guessSelect.appendChild(opt);
      });
  });

  // ✅ [3] 제출 버튼 클릭 시
  btn.addEventListener("click", () => {
    if (btn.disabled) return; // 혹시라도 중복 클릭 방지

    const myName = myNameSelect.value;
    const guess = guessSelect.value;

    if (!myName || !guess) {
      msg.innerText = "⚠️ 어허.. 둘다 선택해라!";
      msg.style.color = "red";
      return;
    }

    // 정답 비교
    const result = manittoMap[myName] === guess ? "정답" : "오답";

    db.ref("responses").push({
      name: myName,
      guess: guess,
      result: result,
      timestamp: new Date().toISOString()
    });

    // ✅ [4] localStorage에 오늘 날짜 기록
    localStorage.setItem("lastSubmitDate", today);

    // ✅ [5] 버튼 비활성화 + 메시지 출력
    btn.disabled = true;
    msg.style.color = "green";
    msg.innerText = "✅ 제출 완! 오늘은 여기까지~ 내일 다시 시도!";
  });
});

