const icons = ['🍎','🍌','🍇','🍊','🍒','🥝','🍍','🥥'];
let cards = [...icons, ...icons];
let flipped = [];
let score1 = 0, score2 = 0;
let turn = 1;

let time1 = 300, time2 = 300;
let timer;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function format(t) {
  let m = String(Math.floor(t / 60)).padStart(2, "0");
  let s = String(t % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (turn === 1) {
      time1--;
      document.getElementById("t1").innerText = `Player 1 Time Left: ${format(time1)}`;
      if (time1 <= 0) { alert("Player 2 Wins!"); end(); }
    } else {
      time2--;
      document.getElementById("t2").innerText = `Player 2 Time Left: ${format(time2)}`;
      if (time2 <= 0) { alert("Player 1 Wins!"); end(); }
    }
  }, 1000);
}

function buildBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  shuffle(cards);
  cards.forEach((val, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.icon = val;
    card.dataset.id = i;
    card.textContent = "❓";
    card.onclick = () => flip(card);
    board.appendChild(card);
  });
}

function flip(c) {
  if (flipped.length === 2 || c.classList.contains("flipped")) return;
  c.textContent = c.dataset.icon;
  flipped.push(c);

  if (flipped.length === 2) setTimeout(check, 800);
}

function check() {
  let [a, b] = flipped;
  if (a.dataset.icon === b.dataset.icon) {
    a.classList.add("flipped");
    b.classList.add("flipped");

    if (turn === 1) { score1++; }
    else { score2++; }

    updateUI();
  } else {
    a.textContent = "❓";
    b.textContent = "❓";
    turn = turn === 1 ? 2 : 1;
    updateUI();
    startTimer();
  }
  flipped = [];
  checkWin();
}

function checkWin() {
  if (score1 + score2 === icons.length) {
    clearInterval(timer);
    let msg = score1 > score2 ? "Player 1 Wins!" : "Player 2 Wins!";
    if (score1 === score2) msg = "Tie!";
    alert(msg);
  }
}

function updateUI() {
  document.getElementById("p1").innerText = `Player 1 Score: ${score1}`;
  document.getElementById("p2").innerText = `Player 2 Score: ${score2}`;
  document.getElementById("turn").innerText = `Player ${turn}`;
}

function end() {
  clearInterval(timer);
}

function startGame() {
  cards = [...icons, ...icons];
  score1 = score2 = 0; 
  turn = 1;
  time1 = time2 = 300;
  updateUI();
  document.getElementById("t1").innerText = `Player 1 Time Left: ${format(time1)}`;
  document.getElementById("t2").innerText = `Player 2 Time Left: ${format(time2)}`;
  buildBoard();
  startTimer();
}

startGame();
