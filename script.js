const loginPage = document.getElementById('login-page');
const examPage = document.getElementById('exam-page');
const resultPage = document.getElementById('result-page');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const toggleEye = document.getElementById('toggleEye');

const questionBox = document.getElementById('question-box');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const logoutBtn = document.getElementById('logoutBtn');

let questions = [
  { q: "Apa fungsi utama teks eksposisi?", c: ["Menghibur", "Menjelaskan", "Mendeskripsikan", "Membujuk"], a: 1 },
  { q: "Kata baku dari 'resiko' adalah?", c: ["Resiko", "Ressiko", "Risiko", "Riziko"], a: 2 },
  { q: "Kalimat efektif adalah kalimat yang...", c: ["Bertele-tele", "Singkat tapi jelas", "Mengandung banyak makna", "Menggunakan majas"], a: 1 }
];

let current = 0;
let answers = Array(questions.length).fill(null);
let timer = 60 * 60;
let timerInterval;

toggleEye.addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

loginBtn.addEventListener("click", () => {
  if (usernameInput.value.trim() === "" || passwordInput.value.trim() === "") {
    alert("Isi username dan password!");
    return;
  }
  loginPage.classList.remove("active");
  examPage.classList.add("active");
  startTimer();
  renderQuestion();
});

function renderQuestion() {
  let q = questions[current];
  questionBox.innerHTML = `
    <h3>Soal ${current + 1} dari ${questions.length}</h3>
    <p>${q.q}</p>
    ${q.c.map((opt, i) => `
      <div class="option ${answers[current] === i ? "selected" : ""}" data-i="${i}">
        ${String.fromCharCode(65 + i)}. ${opt}
      </div>`).join("")}
  `;

  document.querySelectorAll(".option").forEach((opt) => {
    opt.addEventListener("click", () => {
      answers[current] = parseInt(opt.dataset.i);
      renderQuestion();
    });
  });

  prevBtn.disabled = current === 0;
  nextBtn.textContent = current === questions.length - 1 ? "Selesai" : "Selanjutnya →";
}

prevBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    finishExam();
  }
});

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    let m = String(Math.floor(timer / 60)).padStart(2, "0");
    let s = String(timer % 60).padStart(2, "0");
    timerEl.textContent = `${m}:${s}`;
    if (timer <= 0) {
      clearInterval(timerInterval);
      finishExam();
    }
  }, 1000);
}

function finishExam() {
  clearInterval(timerInterval);
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.a) correct++;
  });
  let score = (correct / questions.length) * 100;
  scoreEl.textContent = score.toFixed(2);
  examPage.classList.remove("active");
  resultPage.classList.add("active");
}

logoutBtn.addEventListener("click", () => {
  resultPage.classList.remove("active");
  loginPage.classList.add("active");
  usernameInput.value = "";
  passwordInput.value = "";
  timer = 60 * 60;
  answers.fill(null);
  current = 0;
  clearInterval(timerInterval);
  timerEl.textContent = "60:00";
});
