// ==================== QUIZ DATA ====================

// Safely encode HTML special chars so option text like "<h1>" displays literally
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const QUIZZES = [
  {
    id: "html",
    title: "HTML Fundamentals",
    category: "Web Dev",
    description: "Test your knowledge of HTML tags, structure, and semantics.",
    image: "https://www.codermantra.com/wp-content/uploads/2023/03/html-quiz.png",
    questions: [
      { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tabular Markup Language", "None of these"], answer: 0 },
      { q: "Which HTML tag is used for the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: 2 },
      { q: "What is the correct HTML element for inserting a line break?", options: ["<lb>", "<break>", "<br>", "<newline>"], answer: 2 },
      { q: "Which attribute is used to specify a unique id for an HTML element?", options: ["class", "id", "name", "key"], answer: 1 },
      { q: "What is the correct HTML for creating a hyperlink?", options: ["<a href='url'>link</a>", "<a>url</a>", "<link href='url'>", "<hyperlink>url</hyperlink>"], answer: 0 },
      { q: "Which HTML element defines the document's body?", options: ["<main>", "<section>", "<body>", "<content>"], answer: 2 },
      { q: "What is the purpose of the <meta> tag?", options: ["Define page styles", "Provide metadata", "Insert images", "Create tables"], answer: 1 },
      { q: "Which tag is used to create an unordered list?", options: ["<ol>", "<li>", "<dl>", "<ul>"], answer: 3 },
      { q: "What does the alt attribute in <img> do?", options: ["Sets image size", "Links to image", "Provides alternative text", "Adds border"], answer: 2 },
      { q: "Which HTML element is used to define a table row?", options: ["<td>", "<th>", "<tr>", "<table>"], answer: 2 }
    ]
  },
  {
    id: "css",
    title: "CSS Mastery",
    category: "Web Dev",
    description: "Challenge yourself with CSS layout, selectors, and properties.",
    image: "https://www.codermantra.com/wp-content/uploads/2023/03/css-quiz.png",
    questions: [
      { q: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"], answer: 1 },
      { q: "Which property is used to change the background color?", options: ["color", "background-color", "bgcolor", "bg-color"], answer: 1 },
      { q: "How do you select an element with id 'demo'?", options: [".demo", "*demo", "#demo", "demo"], answer: 2 },
      { q: "Which CSS property controls text size?", options: ["text-size", "font-size", "text-style", "font-style"], answer: 1 },
      { q: "What is the default value of the position property?", options: ["relative", "fixed", "absolute", "static"], answer: 3 },
      { q: "Which property is used to create space between elements?", options: ["spacing", "padding", "margin", "border"], answer: 2 },
      { q: "How do you make each word in a text start with a capital letter?", options: ["text-transform: capitalize", "text-transform: uppercase", "transform: capitalize", "font-variant: small-caps"], answer: 0 },
      { q: "Which display value makes an element a flex container?", options: ["block", "inline", "flex", "grid-flex"], answer: 2 },
      { q: "What does z-index control?", options: ["Zoom level", "Horizontal position", "Stacking order", "Font weight"], answer: 2 },
      { q: "Which pseudo-class targets a hovered element?", options: [":active", ":focus", ":visited", ":hover"], answer: 3 }
    ]
  },
  {
    id: "javascript",
    title: "JavaScript Quiz",
    category: "Programming",
    description: "From basics to closures — how well do you know JS?",
    image: "https://www.codermantra.com/wp-content/uploads/2023/03/javascript-quiz.png",
    questions: [
      { q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "both", "none"], answer: 1 },
      { q: "What is the output of typeof null?", options: ["null", "undefined", "object", "string"], answer: 2 },
      { q: "Which method removes the last element from an array?", options: ["pop()", "push()", "shift()", "splice()"], answer: 0 },
      { q: "What does === check?", options: ["Value only", "Type only", "Value and type", "Reference"], answer: 2 },
      { q: "Which built-in method combines two arrays?", options: ["merge()", "join()", "concat()", "append()"], answer: 2 },
      { q: "What is a closure?", options: ["A loop construct", "A function with access to outer scope", "A class method", "An error handler"], answer: 1 },
      { q: "How do you convert a string to an integer?", options: ["int()", "toInteger()", "parseInt()", "Number.toInt()"], answer: 2 },
      { q: "Which event fires when the DOM is fully loaded?", options: ["onload", "DOMContentLoaded", "domReady", "pageload"], answer: 1 },
      { q: "What is the result of 0.1 + 0.2 === 0.3?", options: ["true", "false", "undefined", "NaN"], answer: 1 },
      { q: "Which method is used to serialize an object to JSON?", options: ["JSON.parse()", "JSON.stringify()", "JSON.serialize()", "JSON.encode()"], answer: 1 }
    ]
  },
  {
    id: "science",
    title: "General Science",
    category: "Science",
    description: "Physics, chemistry, and biology — test your science knowledge!",
    image: "https://www.kidsworldfun.com/images/quiz/General-Science-Quiz.jpg",
    questions: [
      { q: "What is the chemical symbol for water?", options: ["WA", "H2O", "HO2", "OHH"], answer: 1 },
      { q: "What planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], answer: 2 },
      { q: "What force keeps planets in orbit?", options: ["Magnetism", "Friction", "Gravity", "Electricity"], answer: 2 },
      { q: "What is the speed of light (approximate)?", options: ["300,000 km/s", "150,000 km/s", "600,000 km/s", "30,000 km/s"], answer: 0 },
      { q: "What gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: 2 },
      { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"], answer: 2 },
      { q: "What is the atomic number of Carbon?", options: ["6", "12", "8", "14"], answer: 0 },
      { q: "What is the boiling point of water at sea level?", options: ["90°C", "110°C", "100°C", "80°C"], answer: 2 },
      { q: "Which organ produces insulin?", options: ["Liver", "Kidney", "Heart", "Pancreas"], answer: 3 },
      { q: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], answer: 2 }
    ]
  },
  {
    id: "history",
    title: "World History",
    category: "History",
    description: "Journey through world history events, figures, and civilizations.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1y-LldeE0R0JWgktfCPkkqZ5VaP_B-xQ45g&s",
    questions: [
      { q: "In what year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: 2 },
      { q: "Who was the first President of the United States?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], answer: 1 },
      { q: "Which ancient wonder was located in Alexandria?", options: ["Hanging Gardens", "Colossus of Rhodes", "Lighthouse of Alexandria", "Statue of Zeus"], answer: 2 },
      { q: "The French Revolution began in which year?", options: ["1776", "1789", "1799", "1804"], answer: 1 },
      { q: "Who wrote the theory of evolution by natural selection?", options: ["Isaac Newton", "Albert Einstein", "Charles Darwin", "Gregor Mendel"], answer: 2 },
      { q: "Which empire was ruled by Julius Caesar?", options: ["Greek Empire", "Ottoman Empire", "Roman Empire", "Persian Empire"], answer: 2 },
      { q: "What was the name of the first artificial satellite in space?", options: ["Apollo 1", "Vostok 1", "Sputnik 1", "Explorer 1"], answer: 2 },
      { q: "The Berlin Wall fell in which year?", options: ["1987", "1989", "1991", "1993"], answer: 1 },
      { q: "Who was the Egyptian pharaoh associated with the golden mask?", options: ["Ramses II", "Cleopatra", "Tutankhamun", "Thutmose III"], answer: 2 },
      { q: "Which country was the first to grant women the right to vote?", options: ["USA", "UK", "New Zealand", "France"], answer: 2 }
    ]
  }
];

// ==================== STATE ====================

let currentUser = null;
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let quizTimeLeft = 0; // seconds remaining for entire quiz
let activeCategory = "All";

// ==================== PAGES ====================

const ALL_PAGES = [
  "homePage", "signUp_Page", "signIn_Page",
  "quizSelectPage", "quizPage", "resultPage", "reviewPage", "profilePage"
];

function showPage(pageId) {
  ALL_PAGES.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove("hidden");
    window.scrollTo(0, 0);
  }
}

// ==================== LOCAL STORAGE HELPERS ====================

function getUsers() {
  try { return JSON.parse(localStorage.getItem("users")) || []; }
  catch (e) { return []; }
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getResults() {
  try { return JSON.parse(localStorage.getItem("results")) || []; }
  catch (e) { return []; }
}

function saveResults(results) {
  localStorage.setItem("results", JSON.stringify(results));
}

function setCurrentUser(user) {
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function clearCurrentUser() {
  currentUser = null;
  localStorage.removeItem("currentUser");
}

// ==================== AUTH ====================

function handleSignUp(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (!name || !email || !password) {
    showToast("Please fill in all fields.", "error"); return;
  }
  if (password !== confirm) {
    showToast("Passwords do not match.", "error"); return;
  }
  if (password.length < 6) {
    showToast("Password must be at least 6 characters.", "error"); return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    showToast("An account with this email already exists.", "error"); return;
  }

  const newUser = {
    id: Date.now().toString(),
    name, email, password,
    joinedYear: new Date().getFullYear()
  };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  showToast("Account created successfully! Welcome, " + name + "!");
  setTimeout(() => renderQuizSelect(), 800);
}

function handleSignIn(e) {
  e.preventDefault();
  const email = document.getElementById("signInEmail").value.trim();
  const password = document.getElementById("signInPassword").value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    setCurrentUser(user);
    showToast("Welcome back, " + user.name + "!");
    setTimeout(() => renderQuizSelect(), 800);
  } else {
    showToast("Invalid email or password.", "error");
  }
}

function handleLogOut() {
  clearCurrentUser();
  stopTimer();
  showPage("signIn_Page");
}

// ==================== TOAST ====================

function showToast(message, type = "success") {
  const existing = document.getElementById("toastMsg");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "toastMsg";
  toast.textContent = message;
  toast.className = `
    fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg font-semibold text-white shadow-lg text-sm
    ${type === "error" ? "bg-red-500" : "bg-green-500"}
    transition-all duration-300
  `.replace(/\s+/g, " ").trim();

  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 2500);
}

// ==================== HOME PAGE ====================

function renderHomePage() {
  // Wire "Get Started" button
  const getStartedBtn = document.querySelector("#homePage a[href='']");
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", e => {
      e.preventDefault();
      renderQuizSelect();
    });
  }
  showPage("homePage");
}

// ==================== QUIZ SELECT PAGE ====================

function renderQuizSelect(filter = "All") {
  activeCategory = filter;
  showPage("quizSelectPage");

  // -- Category tabs --
  const tabsContainer = document.querySelector("#quizSelectPage .flex.gap-2.items-center");
  if (tabsContainer) {
    const categories = ["All", "Web Dev", "Programming", "Science", "History"];
    tabsContainer.innerHTML = "";
    categories.forEach(cat => {
      const span = document.createElement("span");
      span.textContent = cat;
      span.className = `px-3 py-1 rounded-[8px] cursor-pointer transition-all text-sm font-medium whitespace-nowrap
        ${cat === activeCategory ? "bg-[#0D78F2] text-white" : "bg-[#E5E8EB] text-[#121417] hover:bg-[#d0d4d9]"}`;
      span.addEventListener("click", () => renderQuizSelect(cat));
      tabsContainer.appendChild(span);
    });
  }

  const filtered = QUIZZES.filter(q => activeCategory === "All" || q.category === activeCategory);

  // -- Featured (first 3) --
  const featuredGrid = document.querySelector("#quizSelectPage .grid.md\\:grid-cols-3");
  if (featuredGrid) {
    const featured = filtered.slice(0, 3);
    featuredGrid.innerHTML = featured.map(quiz => `
      <div class="flex flex-col gap-2 cursor-pointer group" data-quiz-id="${quiz.id}">
        <img src="${quiz.image}" alt="${quiz.title}" class="w-full aspect-[16/9] object-contain rounded-[8px] group-hover:opacity-90 transition-all" />
        <div>
          <h5 class="font-semibold">${quiz.title}</h5>
          <p class="text-[14px] text-[#61738A]">${quiz.description}</p>
          <span class="inline-block mt-1 text-xs bg-[#E5E8EB] px-2 py-0.5 rounded">${quiz.category}</span>
        </div>
      </div>
    `).join("");

    featuredGrid.querySelectorAll("[data-quiz-id]").forEach(card => {
      card.addEventListener("click", () => {
        const quiz = QUIZZES.find(q => q.id === card.dataset.quizId);
        if (quiz) startQuiz(quiz);
      });
    });
  }

  // -- All quizzes list --
  const allContainer = document.querySelector("#quizSelectPage .lg\\:mx-40.mx-5.lg\\:my-10.my-5:last-of-type > div");
  if (allContainer) {
    allContainer.innerHTML = `<h4 class="font-bold text-xl mb-8">All Quizzes</h4>` +
      filtered.map(quiz => `
        <div class="md:flex justify-between items-center border-b border-[#DBE0E5] pb-4 mb-4 cursor-pointer hover:bg-[#f8f9fa] rounded-[8px] px-2 transition-all" data-quiz-id="${quiz.id}">
          <div>
            <h5 class="font-semibold text-[15px]">${quiz.title}</h5>
            <p class="text-[12px] text-[#61738A] mb-1">${quiz.description}</p>
            <span class="text-xs bg-[#E5E8EB] px-2 py-0.5 rounded">${quiz.category} · 10 Questions</span>
          </div>
          <img src="${quiz.image}" alt="${quiz.title}" class="w-full md:w-[180px] aspect-[16/9] object-contain mt-3 md:mt-0 rounded-[8px]" />
        </div>
      `).join("");

    allContainer.querySelectorAll("[data-quiz-id]").forEach(card => {
      card.addEventListener("click", () => {
        const quiz = QUIZZES.find(q => q.id === card.dataset.quizId);
        if (quiz) startQuiz(quiz);
      });
    });
  }
}

// ==================== QUIZ PAGE ====================

function startQuiz(quiz) {
  currentQuiz = quiz;
  currentQuestionIndex = 0;
  userAnswers = new Array(quiz.questions.length).fill(null);
  quizTimeLeft = quiz.questions.length * 30; // 30s per question total
  renderQuizPage();
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimer() {
  stopTimer();
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    quizTimeLeft--;
    updateTimerDisplay();
    if (quizTimeLeft <= 0) {
      stopTimer();
      finishQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const hours = Math.floor(quizTimeLeft / 3600);
  const minutes = Math.floor((quizTimeLeft % 3600) / 60);
  const seconds = quizTimeLeft % 60;

  const hEl = document.getElementById("timer-hours");
  const mEl = document.getElementById("timer-minutes");
  const sEl = document.getElementById("timer-seconds");
  if (hEl) hEl.textContent = String(hours).padStart(2, "0");
  if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
  if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
}

function renderQuizPage() {
  showPage("quizPage");

  const page = document.getElementById("quizPage");
  const total = currentQuiz.questions.length;
  const q = currentQuiz.questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / total) * 100);

  // -- Progress bar (custom div-based) --
  const progressFill = document.getElementById("progressFill");
  if (progressFill) progressFill.style.width = progress + "%";

  const questionCounter = document.getElementById("questionCounter");
  if (questionCounter) questionCounter.innerHTML = `Question <span>${currentQuestionIndex + 1}</span> of <span>${total}</span>`;

  // -- Timer elements (attach IDs) --
  const timerBoxes = page.querySelectorAll(".bg-\\[\\#F0F2F5\\].rounded-\\[8px\\]");
  if (timerBoxes[0]) timerBoxes[0].id = "timer-hours";
  if (timerBoxes[1]) timerBoxes[1].id = "timer-minutes";
  if (timerBoxes[2]) timerBoxes[2].id = "timer-seconds";

  // -- Question text --
  const questionEl = page.querySelector("h4.my-5");
  if (questionEl) questionEl.textContent = q.q;

  // -- Options --
  const optionsContainer = page.querySelector(".flex.flex-col.justify-center.gap-2");
  if (optionsContainer) {
    // Remove old option labels (keep the nav buttons div)
    const navDiv = optionsContainer.querySelector(".flex.justify-between.items-center.mt-\\[12px\\]");
    optionsContainer.innerHTML = "";

    q.options.forEach((opt, idx) => {
      const isSelected = userAnswers[currentQuestionIndex] === idx;
      const label = document.createElement("label");
      label.htmlFor = `option_${idx}`;
      label.className = `flex items-center gap-3 border-1 px-4 py-2 rounded-[8px] cursor-pointer transition-all
        ${isSelected ? "border-[#0D78F2] bg-[#EEF5FF]" : "border-[#DBE0E5] hover:border-[#0D78F2]"}`;
      label.innerHTML = `
        <input type="radio" name="quizOption" id="option_${idx}" value="${idx}" ${isSelected ? "checked" : ""} class="accent-[#0D78F2]"/>
        <span class="cursor-pointer">${opt}</span>
      `;
      label.addEventListener("click", () => {
        userAnswers[currentQuestionIndex] = idx;
        renderQuizPage(); // re-render to reflect selection
      });
      optionsContainer.appendChild(label);
    });

    // -- Nav buttons --
    const navDiv2 = document.createElement("div");
    navDiv2.className = "flex justify-between items-center mt-[12px]";

    const isLast = currentQuestionIndex === total - 1;

    navDiv2.innerHTML = `
      <span>
        <a id="prevBtn" href=""
          class="text-black rounded-[8px] bg-[#F0F2F5] hover:bg-[#d5d6d8] md:px-[20px] px-3 md:py-[12px] py-[6px] w-full font-bold text-[16px] cursor-pointer transition-all
            ${currentQuestionIndex === 0 ? "opacity-40 pointer-events-none" : ""}">Previous</a>
      </span>
      <span>
        <a id="nextBtn" href=""
          class="text-white rounded-[8px] bg-[#0D78F2] hover:bg-[#116dd6] md:px-[20px] px-3 md:py-[12px] py-[6px] w-full font-bold text-[16px] cursor-pointer transition-all">${isLast ? "Submit" : "Next"}</a>
      </span>
    `;

    optionsContainer.appendChild(navDiv2);

    document.getElementById("prevBtn")?.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentQuestionIndex > 0) { currentQuestionIndex--; renderQuizPage(); }
    });

    document.getElementById("nextBtn")?.addEventListener("click", (e) => {
      e.preventDefault();
      if (isLast) { stopTimer(); finishQuiz(); }
      else { currentQuestionIndex++; renderQuizPage(); }
    });
  }

  // start timer only when first rendering (first question, not navigating back)
  if (currentQuestionIndex === 0 && !timerInterval) startTimer();
}

// ==================== RESULT PAGE ====================

function finishQuiz() {
  stopTimer();
  if (!currentQuiz) return;

  const total = currentQuiz.questions.length;
  const correct = currentQuiz.questions.reduce((acc, q, i) => {
    return acc + (userAnswers[i] === q.answer ? 1 : 0);
  }, 0);
  const percentage = Math.round((correct / total) * 100);

  // Save result
  const results = getResults();
  const result = {
    userId: currentUser.id,
    quizId: currentQuiz.id,
    quizTitle: currentQuiz.title,
    score: correct,
    total,
    percentage,
    date: new Date().toISOString().split("T")[0],
    userAnswers: [...userAnswers],
    timestamp: Date.now()
  };
  results.push(result);
  saveResults(results);

  renderResultPage(result);
}

function renderResultPage(result) {
  showPage("resultPage");
  const page = document.getElementById("resultPage");

  // Progress bar
  const rangeEl = page.querySelector("input[type='range']");
  if (rangeEl) rangeEl.value = result.percentage;

  // "Quiz Completed" label & %
  const completionRow = page.querySelector(".flex.justify-between.items-center.text-\\[14px\\]");
  if (completionRow) {
    completionRow.innerHTML = `<span>Quiz Completed</span><span>${result.percentage}%</span>`;
  }

  // Score card
  const scoreCard = page.querySelector(".rounded-\\[8px\\].bg-\\[\\#F0F2F5\\]");
  if (scoreCard) {
    scoreCard.innerHTML = `
      <span class="text-[16px] font-medium">Score</span>
      <h5 class="text-[24px] font-bold"><span>${result.score}</span>/<span>${result.total}</span></h5>
    `;
  }

  // Congrats message
  const msgEl = page.querySelector("p.text-\\[16px\\].md\\:text-center");
  if (msgEl) {
    const emoji = result.percentage >= 80 ? "🎉" : result.percentage >= 50 ? "👍" : "📚";
    const phrase = result.percentage >= 80
      ? "Excellent work! Your performance indicates a strong understanding."
      : result.percentage >= 50
        ? "Good effort! Keep practicing to improve further."
        : "Keep studying and try again — you've got this!";
    msgEl.innerHTML = `${emoji} Congratulations, <span class="font-semibold">${currentUser.name}</span>! You scored <span class="font-semibold">${result.score}</span> out of <span class="font-semibold">${result.total}</span>. ${phrase}`;
  }

  // Buttons
  const btnContainer = page.querySelector(".flex.flex-col.flex-col-reverse");
  if (btnContainer) {
    btnContainer.innerHTML = `
      <button id="takeAnotherBtn"
        class="text-black rounded-[8px] bg-[#F0F2F5] hover:bg-[#d5d6d8] md:px-[20px] px-3 md:py-[12px] py-[10px] font-bold text-[16px] cursor-pointer transition-all">
        Take Another Quiz
      </button>
      <button id="reviewAnswersBtn"
        class="text-white rounded-[8px] bg-[#0D78F2] hover:bg-[#116dd6] md:px-[20px] px-3 md:py-[12px] py-[10px] font-bold text-[16px] cursor-pointer transition-all">
        Review Answers
      </button>
    `;
    document.getElementById("takeAnotherBtn")?.addEventListener("click", () => renderQuizSelect());
    document.getElementById("reviewAnswersBtn")?.addEventListener("click", () => renderReviewPage(result));
  }
}

// ==================== REVIEW PAGE ====================

function renderReviewPage(result) {
  showPage("reviewPage");
  const page = document.getElementById("reviewPage");

  const quiz = QUIZZES.find(q => q.id === result.quizId);
  if (!quiz) return;

  const wrongAnswers = quiz.questions
    .map((q, i) => ({ ...q, index: i, userAnswer: result.userAnswers[i] }))
    .filter(q => q.userAnswer !== q.answer);

  const contentWrapper = page.querySelector(".lg\\:mx-40.md\\:mx-20.mx-5");
  if (!contentWrapper) return;

  // Build content matching original HTML structure exactly
  contentWrapper.innerHTML = `
    <div>
      <h4 class="font-bold md:text-[32px] text-[20px] text-center mb-2">
        Review Incorrect Answers
      </h4>
      ${wrongAnswers.length === 0
      ? `<div class="text-center py-10">
            <p class="text-green-600 font-bold text-2xl">🎯 Perfect Score!</p>
            <p class="text-[#61738A] mt-2">You answered all questions correctly!</p>
          </div>`
      : wrongAnswers.map((q) => `
            <div class="mb-2">
              <h5 class="font-bold text-[18px]">Question <span>${q.index + 1}</span></h5>
              <p>${escapeHtml(q.q)}</p>
              <p>Your answer: <span class="font-semibold">${q.userAnswer !== null ? escapeHtml(q.options[q.userAnswer]) : "Not answered"}</span></p>
              <p>Correct answer: <span class="font-semibold">${escapeHtml(q.options[q.answer])}</span></p>
            </div>
          `).join("")
    }
    </div>
    <!-- button -->
    <div class="flex justify-end items-center">
      <a id="backToQuizzesBtn" href=""
        class="text-white rounded-[8px] bg-[#0D78F2] hover:bg-[#116dd6] md:px-[20px] px-3 md:py-[12px] py-[10px] md:inline block w-full md:w-auto font-bold text-[16px] text-center cursor-pointer transition-all">Back to Quizzes</a>
    </div>
  `;

  document.getElementById("backToQuizzesBtn")?.addEventListener("click", (e) => { e.preventDefault(); renderQuizSelect(); });
}

// ==================== PROFILE PAGE ====================

function renderProfilePage() {
  showPage("profilePage");
  const page = document.getElementById("profilePage");

  const results = getResults().filter(r => r.userId === currentUser.id);
  const totalAttempted = results.length;
  const avgScore = totalAttempted > 0
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / totalAttempted)
    : 0;

  // Header info
  const nameEl = page.querySelector("h5.font-bold.text-\\[22px\\]");
  if (nameEl) nameEl.textContent = currentUser.name;

  const infoParas = page.querySelectorAll(".text-center > p.text-\\[\\#61738A\\]");
  if (infoParas[0]) infoParas[0].textContent = "Quiz Enthusiast";
  if (infoParas[1]) infoParas[1].textContent = `Joined ${currentUser.joinedYear || new Date().getFullYear()}`;

  // Personal info
  const nameField = page.querySelector(".whitespace-nowrap");
  if (nameField) nameField.textContent = currentUser.name;

  const emailField = page.querySelector(".border-t-1.py-5.border-\\[\\#DBE0E5\\].w-full > p:last-child");
  if (emailField) emailField.textContent = currentUser.email;

  // Stats below personal info — inject dynamically
  const bioDiv = page.querySelector(".border-t-1.py-5.border-\\[\\#DBE0E5\\]:last-of-type");
  if (bioDiv) {
    bioDiv.innerHTML = `
      <p class="text-[#61738A]">Total Quizzes Taken</p>
      <p class="font-semibold">${totalAttempted}</p>
      <p class="text-[#61738A] mt-2">Average Score</p>
      <p class="font-semibold">${avgScore}%</p>
    `;
  }

  // Quiz history table
  const historySection = page.querySelector("div:has(> h4.text-\\[22px\\])");
  if (historySection) {
    historySection.innerHTML = `
      <h4 class="text-[22px] font-bold mb-5">Quiz History</h4>
      <div class="border-1 rounded-[8px] border-[#DBE0E5] overflow-hidden">
        <table class="border-collapse w-full text-left rounded-[8px] md:text-[16px] text-[12px]">
          <thead class="bg-[#F0F2F5]">
            <tr>
              <th class="p-3">Quiz Name</th>
              <th class="p-3">Score</th>
              <th class="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            ${results.length === 0
        ? `<tr><td colspan="3" class="text-center p-5 text-[#61738A]">No quizzes taken yet!</td></tr>`
        : results.slice().reverse().map(r => `
                  <tr>
                    <td class="border-t border-[#DBE0E5] px-3 py-2">${r.quizTitle}</td>
                    <td class="border-t border-[#DBE0E5] px-3 py-2 text-[#61738A]">${r.score}/${r.total} (${r.percentage}%)</td>
                    <td class="border-t border-[#DBE0E5] px-3 py-2 text-[#61738A]">${r.date}</td>
                  </tr>
                `).join("")
      }
          </tbody>
        </table>
      </div>
    `;
  }
}

// ==================== NAV WIRING ====================

function wireNavLinks() {
  // Home page nav
  document.getElementById("homePage")?.querySelectorAll("nav a").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const text = a.textContent.trim();
      if (text === "Quizzes") renderQuizSelect();
      else if (text === "Profile") renderProfilePage();
      else if (text === "Home") renderHomePage();
    });
  });

  // Log out wiring (home page)
  document.getElementById("logOut_btn")?.addEventListener("click", e => {
    e.preventDefault();
    handleLogOut();
  });

  // Wire all pages' nav links via class delegation
  ["quizSelectPage", "quizPage", "resultPage", "reviewPage", "profilePage"].forEach(pageId => {
    const page = document.getElementById(pageId);
    if (!page) return;
    page.querySelectorAll("nav a").forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        const text = a.textContent.trim();
        if (text === "Home") renderHomePage();
        else if (text === "Quizzes") renderQuizSelect();
        else if (text === "Profile") renderProfilePage();
      });
    });
    // Profile pic -> profile page
    page.querySelectorAll("img[alt='profile-pic']").forEach(img => {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => renderProfilePage());
    });
  });
}

// ==================== INIT ====================

document.addEventListener("DOMContentLoaded", () => {
  // Load current user
  try {
    const stored = localStorage.getItem("currentUser");
    if (stored) currentUser = JSON.parse(stored);
  } catch (e) { currentUser = null; }

  // Seed quiz data to localStorage (for reference)
  localStorage.setItem("quizzes", JSON.stringify(QUIZZES));

  // --- Sign Up page wiring ---
  // "Sign In" button in signup navbar
  document.querySelector("#signUp_Page nav a.bg-\\[\\#0D78F2\\]")?.addEventListener("click", e => {
    e.preventDefault(); showPage("signIn_Page");
  });

  // "Sign In" link below form
  document.getElementById("signIn_btn")?.addEventListener("click", e => {
    e.preventDefault(); showPage("signIn_Page");
  });

  // Sign Up form — fix input IDs to avoid conflict with signIn page
  const signUpForm = document.getElementById("signUp_Form");
  if (signUpForm) {
    signUpForm.addEventListener("submit", handleSignUp);
  }

  // --- Sign In page wiring ---
  // Fix IDs for sign in inputs (they shared ids with signup in original HTML)
  const signInEmail = document.querySelector("#signIn_Page #email");
  if (signInEmail) signInEmail.id = "signInEmail";
  const signInPass = document.querySelector("#signIn_Page #password");
  if (signInPass) signInPass.id = "signInPassword";

  // "Sign Up" buttons on sign in page
  document.querySelectorAll("#signIn_Page .signUp_btn, #signIn_Page nav a").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault(); showPage("signUp_Page");
    });
  });

  // Sign In form
  const signInForm = document.getElementById("signIn_Form");
  if (signInForm) {
    signInForm.addEventListener("submit", handleSignIn);
  }

  // Wire all nav links
  wireNavLinks();

  // --- Initial route ---
  if (currentUser) {
    renderQuizSelect();
  } else {
    showPage("signIn_Page");
  }
});
