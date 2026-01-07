// =====================
// ELEMENT REFERENCES
// =====================
const incomeInput = document.getElementById("incomeInput");
const expenseInput = document.getElementById("expenseInput");
const categorySelect = document.getElementById("categorySelect");
const noteInput = document.getElementById("noteInput");

const addIncomeBtn = document.getElementById("addIncomeBtn");
const addExpenseBtn = document.getElementById("addExpenseBtn");

const totalIncomeEl = document.getElementById("totalIncome");
const totalExpensesEl = document.getElementById("totalExpenses");
const savingsEl = document.getElementById("savings");
const dailyLimitEl = document.getElementById("dailyLimit");

const insightsList = document.getElementById("insightsList");
const rewardPointsEl = document.getElementById("rewardPoints");
const rewardBadgesEl = document.getElementById("rewardBadges");

// =====================
// DATA STORAGE
// =====================
let incomes = JSON.parse(localStorage.getItem("incomes")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let rewardPoints = JSON.parse(localStorage.getItem("rewardPoints")) || 0;
let badges = JSON.parse(localStorage.getItem("badges")) || [];

// =====================
// SAVE DATA
// =====================
function saveAll() {
  localStorage.setItem("incomes", JSON.stringify(incomes));
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("rewardPoints", JSON.stringify(rewardPoints));
  localStorage.setItem("badges", JSON.stringify(badges));
}

// =====================
// ADD INCOME
// =====================
function addIncome() {
  const amount = Number(incomeInput.value);
  if (amount <= 0) return;

  incomes.push(amount);
  incomeInput.value = "";
  saveAll();
  updateDashboard();
}

// =====================
// ADD EXPENSE
// =====================
function addExpense() {
  const amount = Number(expenseInput.value);
  const category = categorySelect.value;
  const note = noteInput.value.trim();

  if (amount <= 0) return;

  expenses.push({ amount, category, note });
  expenseInput.value = "";
  noteInput.value = "";

  saveAll();
  updateDashboard();
}

// =====================
// BUDGET SUGGESTION
// =====================
function suggestedBudget(income) {
  return {
    Food: income * 0.30,
    Bills: income * 0.25,
    Transport: income * 0.10,
    Shopping: income * 0.15,
    Savings: income * 0.20
  };
}

// =====================
// DAILY SAFE SPENDING
// =====================
function calculateDailyLimit(savings) {
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const remainingDays = daysInMonth - today.getDate() + 1;
  return remainingDays > 0 ? Math.floor(savings / remainingDays) : 0;
}

// =====================
// AI INSIGHTS
// =====================
function generateInsights(income, expense) {
  insightsList.innerHTML = "";
  const savings = income - expense;
  const budget = suggestedBudget(income);

  addInsight(`💡 Recommended monthly savings: ₹${Math.floor(budget.Savings)}`);

  if (expense > income) {
    addInsight("⚠️ Your expenses exceed income. Reduce non-essential spending.");
  }

  const savingsRate = (savings / income) * 100;
  if (savingsRate < 20) {
    addInsight("📉 Savings rate is low. Aim for at least 20% savings.");
  } else {
    addInsight("✅ Great job maintaining healthy savings!");
    addInsight("📈 Consider FD, RD, or Index Mutual Funds for higher returns.");
  }

  const dailySafe = calculateDailyLimit(savings);
  addInsight(`📅 Safe daily spending limit: ₹${dailySafe}`);
}

// =====================
// REWARDS SYSTEM
// =====================
function calculateRewards(income, expense) {
  const savings = income - expense;
  const savingsRate = (savings / income) * 100;

  if (savingsRate >= 20) {
    rewardPoints += 50;
    addBadge("💰 Smart Saver");
  }

  if (calculateDailyLimit(savings) > 0) {
    rewardPoints += 20;
    addBadge("📅 Budget Discipline");
  }

  saveAll();
  renderRewards();
}

function addBadge(badge) {
  if (!badges.includes(badge)) badges.push(badge);
}

function renderRewards() {
  rewardPointsEl.textContent = rewardPoints;
  rewardBadgesEl.innerHTML = "";
  badges.forEach(b => {
    const li = document.createElement("li");
    li.textContent = b;
    rewardBadgesEl.appendChild(li);
  });
}

// =====================
// DASHBOARD UPDATE
// =====================
function updateDashboard() {
  const totalIncome = incomes.reduce((a, b) => a + b, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const savings = totalIncome - totalExpenses;

  totalIncomeEl.textContent = totalIncome;
  totalExpensesEl.textContent = totalExpenses;
  savingsEl.textContent = savings;

  dailyLimitEl.textContent = calculateDailyLimit(savings);

  generateInsights(totalIncome, totalExpenses);
  calculateRewards(totalIncome, totalExpenses);
}

// =====================
// HELPERS
// =====================
function addInsight(text) {
  const li = document.createElement("li");
  li.textContent = text;
  insightsList.appendChild(li);
}

// =====================
// EVENTS
// =====================
addIncomeBtn.addEventListener("click", addIncome);
addExpenseBtn.addEventListener("click", addExpense);

// =====================
// INIT
// =====================
updateDashboard();
renderRewards();
