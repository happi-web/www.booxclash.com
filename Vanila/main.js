const questions = [
  { question: "Capital of France?", options: ["Berlin", "Paris", "Madrid", "Lisbon"], correctAnswer: "Paris" },
  { question: "Closest planet to the sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correctAnswer: "Mercury" },
  { question: "Largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippo"], correctAnswer: "Blue Whale" },
  { question: "Language for styling web pages?", options: ["HTML", "JavaScript", "Python", "CSS"], correctAnswer: "CSS" },
  { question: "Red + Blue = ?", options: ["Purple", "Green", "Orange", "Brown"], correctAnswer: "Purple" },
  { question: "Spider has how many legs?", options: ["6", "8", "10", "12"], correctAnswer: "8" },
  { question: "Freezing point of water?", options: ["0°C", "32°C", "100°C", "4°C"], correctAnswer: "0°C" },
  { question: "Gas absorbed by plants?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: "Carbon Dioxide" }
];

let players = [
  { id: "p1", name: "Alice" },
  { id: "p2", name: "Bob" },
  { id: "p3", name: "Charlie" },
  { id: "p4", name: "Dana" },
  { id: "p5", name: "Eli" },
  { id: "p6", name: "Faye" },
  { id: "p7", name: "Gabe" },
  { id: "p8", name: "Hana" }
];

let currentPair = [];
let currentRound = 1;
let currentQuestionIndex = 0;
let scores = {};
let timer = 15;
let timerInterval;
let countdown = 5;
let countdownInterval;
let winners = [];
let eliminated = {};
let currentPlayerTurn = 0;
let roundPool = [];
const allPlayers = [...players]; 

const correctSound = new Audio("./sounds/correct.mp3");
const incorrectSound = new Audio("./sounds/incorrect.mp3");


const container = document.getElementById("questionCard");

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

let shownStages = {
  1: false,
  2: false,
  final: false
};

function renderStageIntro(round, callback) {
  let message = "";
  let delay = 5000;

  if (round === 1 && !shownStages[1]) {
    message = "🎯 Round 1 Underway: Knockout Stage";
    shownStages[1] = true;
  } else if (round === 2 && !shownStages[2]) {
    message = "🔥 Round 2 Underway: Semi-Finals";
    shownStages[2] = true;
  } else if (round >= 3 && !shownStages.final) {
    message = "🏆 The Finals Begin: Only One Will Triumph!";
    delay = 10000;
    shownStages.final = true;
  }

  if (message) {
    container.innerHTML = `
      <h2 style="font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #facc15;">${message}</h2>
      <p id="stageCountdown" style="font-size: 48px; font-weight: bold;">${delay / 1000}</p>
    `;

    let remaining = delay / 1000;
    const countdownEl = document.getElementById("stageCountdown");

    const interval = setInterval(() => {
      remaining--;
      countdownEl.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(interval);
        callback();
      }
    }, 1000);
  } else {
    callback();
  }
}

function nextPair() {
  // Check if we have a winner
  if (winners.length === 1 && roundPool.length === 0) {
    clearInterval(timerInterval);
    container.innerHTML = `<h2 class="text-2xl font-bold text-green-400">🏆 Winner: ${winners[0].name}</h2>`;
    return;
  }

  // Start a new round if the roundPool is empty
  if (roundPool.length === 0) {
    if (winners.length > 0) {
      roundPool = [...winners];
      winners = [];
      currentRound++;
      shuffle(roundPool);
    } else {
      // First round - use all players
      roundPool = [...players];
      shuffle(roundPool);
    }
  }

  // Handle odd number of players
  if (roundPool.length === 1) {
    const byePlayer = roundPool.pop();
    winners.push(byePlayer);
    setTimeout(() => nextPair(), 1000);
    return;
  }

  // If we have 0 or 1 players left and winners, prepare next round
  if (roundPool.length < 2 && winners.length > 0) {
    setTimeout(() => nextPair(), 1000);
    return;
  }

  // Set up the next player pair
  currentPair = [roundPool.shift(), roundPool.shift()];
  scores[currentPair[0].id] = 0;
  scores[currentPair[1].id] = 0;
  currentQuestionIndex = 0;
  currentPlayerTurn = 0;

  // Display the appropriate stage intro, then start the countdown
  renderStageIntro(currentRound, renderCountdown);
}


function renderCountdown() {
  clearInterval(countdownInterval);
  countdown = 5;

  container.innerHTML = `
    <h2 style="color:#fb923c; font-size:24px; font-weight:bold">
      Round ${currentRound}
    </h2>
    <p style="font-size:22px; margin-top: 40px">⏳ Get ready!</p>
    <p id="countdown" style="font-size:48px; font-weight:bold; margin-top:10px;">${countdown}</p>
  `;

  countdownInterval = setInterval(() => {
    countdown--;
    document.getElementById("countdown").textContent = countdown;
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      renderQuestion();
    }
  }, 1000);
}

function renderQuestion() {
  clearInterval(timerInterval);
  timer = 15;
  const q = questions[Math.floor(Math.random() * questions.length)];

  container.innerHTML = `
  <div class="timer" id="timer"></div>

  <div class="game-stage" style="display: flex; justify-content: space-around; align-items: center; width: 100%;">
    <div class="player-pod" id="playerA" style="
      width: 200px;
      height: 200px;
      background: rgba(34, 197, 94, 0.1);
      border: 3px solid #22c55e;
      border-radius: 50%;
      display: flex;
      margin:5px;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      color: #22c55e;
      box-shadow: 0 0 20px #22c55e88;">
      ${currentPair[0].name}
    </div>

    <div class="question-screen" id="questionCard" style="
      flex-grow: 1;
      border-radius: 24px;
      text-align: center;
      font-size: 24px;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
      height: 40vh;">
      <h2 style="color:#fb923c; font-size:24px; font-weight:bold">
        Round ${currentRound}
      </h2>
      <p style="font-size:20px; margin:5px 0">${q.question}</p>
      <div id="options"></div>
      <div id="feedback" class="feedback"></div>
      <p style="margin-top: 6px;">${currentPair[0].name}: ${scores[currentPair[0].id]} | ${currentPair[1].name}: ${scores[currentPair[1].id]}</p>
    </div>

    <div class="player-pod" id="playerB" style="
      width: 200px;
      height: 200px;
      background: rgba(239, 68, 68, 0.1);
      border: 3px solid #ef4444;
      border-radius: 50%;
      display: flex;
      margin:5px;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      color: #ef4444;
      box-shadow: 0 0 20px #ef444488;">
      ${currentPair[1].name}
    </div>
  </div>
`;


  const optionsDiv = document.getElementById("options");

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "btn green";
    btn.onclick = () => handleAnswer(opt, q.correctAnswer);
    optionsDiv.appendChild(btn);
  });

  startTimer(q.correctAnswer);
}

function startTimer(correctAnswer) {
  timerInterval = setInterval(() => {
    timer--;
    document.getElementById("timer").textContent = `⏱ ${timer} seconds left`;
    if (timer <= 0) {
      clearInterval(timerInterval);
      handleAnswer(null, correctAnswer);
    }
  }, 1000);
}

function handleAnswer(answer, correctAnswer) {
  clearInterval(timerInterval);
  const currentPlayer = currentPair[currentPlayerTurn];
  const feedback = document.getElementById("feedback");

  const isCorrect = answer === correctAnswer;

  if (isCorrect) {
    scores[currentPlayer.id]++;
    correctSound.currentTime = 0;
    correctSound.play();
  } else {
    incorrectSound.currentTime = 0;
    incorrectSound.play();
  }

  feedback.textContent = `${currentPlayer.name} answered ${isCorrect ? "✅ Correct!" : "❌ Wrong or Timeout!"}`;

  disableButtons(correctAnswer, answer);

  if (scores[currentPlayer.id] === 2) {
    setTimeout(() => evaluatePair(), 1500);
    return;
  }

  currentPlayerTurn = (currentPlayerTurn + 1) % 2;

  setTimeout(() => {
    if (currentPlayerTurn === 0) currentQuestionIndex++;
    if (currentQuestionIndex < 3) {
      renderCountdown();
    } else {
      evaluatePair();
    }
  }, 1500);
}


function disableButtons(correctAnswer, chosen) {
  const buttons = document.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.className = "btn green disabled";
    } else if (btn.textContent === chosen) {
      btn.className = "btn red disabled";
    } else {
      btn.className = "btn disabled";
    }
  });
}

function evaluatePair() {
  const p1 = currentPair[0];
  const p2 = currentPair[1];
  const p1Score = scores[p1.id];
  const p2Score = scores[p2.id];

  let advancingPlayer = null;
  let eliminatedPlayer = null;

  if (p1Score === 2) {
    advancingPlayer = p1;
    eliminatedPlayer = p2;
  } else if (p2Score === 2) {
    advancingPlayer = p2;
    eliminatedPlayer = p1;
  } else {
    // Tiebreaker - random selection if no one reached 2 points
    advancingPlayer = Math.random() < 0.5 ? p1 : p2;
    eliminatedPlayer = advancingPlayer === p1 ? p2 : p1;
  }

  winners.push(advancingPlayer);
  eliminated[eliminatedPlayer.name] = (eliminated[eliminatedPlayer.name] || 0) + 1;

  if (currentRound >= 3 && roundPool.length === 0 && winners.length === 1) {
    // Final winner
    container.innerHTML = `
      <h2 class="text-3xl font-bold text-yellow-400">🎉 Congratulations, ${advancingPlayer.name}!</h2>
      <p style="font-size: 20px; margin-top: 10px;">🏆 You are the Ultimate Champion!</p>
    `;
    updateStatusLists();
    return;
  } else {
    // Standard advance message
    container.innerHTML = `
      <h2 class="text-2xl font-bold text-green-400">✅ ${advancingPlayer.name} advances!</h2>
      <p style="color: #ef4444; font-size: 20px; margin-top: 12px;">❌ ${eliminatedPlayer.name} is eliminated.</p>
    `;
  }

  updateStatusLists();
  setTimeout(() => nextPair(), 2000);
}


function updateStatusLists() {
  const winnersList = document.getElementById("winnersList");
  const eliminatedList = document.getElementById("eliminatedList");
  const playersList = document.getElementById("playersList");

  // Update All Players List
  playersList.innerHTML = "";
  allPlayers.forEach(player => {
    const li = document.createElement("li");
    li.textContent = player.name;
    playersList.appendChild(li);
  });

  // Update Winners List
  winnersList.innerHTML = "";
  const uniqueWinners = new Set(winners.map(p => p.name)); // Avoid duplicates
  uniqueWinners.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    winnersList.appendChild(li);
  });

  // Update Eliminated List
  eliminatedList.innerHTML = "";
  Object.keys(eliminated).forEach(name => {
    const li = document.createElement("li");
    li.textContent = `${name} (${eliminated[name]}x)`;
    eliminatedList.appendChild(li);
  });
}


// Start game
players = shuffle(players);
winners = [];
updateStatusLists();
nextPair();
