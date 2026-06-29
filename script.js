let expenses = [];

function loadExpenses() {
  const saved = localStorage.getItem("expenses");
  if (saved) {
    expenses = JSON.parse(saved);
  }
}

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function render() {
  const list = document.getElementById("expense-list");
  const totalDisplay = document.getElementById("total-display");
  const filter = document.getElementById("filter-category").value;

  let filtered = expenses;
  if (filter !== "All") {
    filtered = expenses.filter(function (e) {
      return e.category === filter;
    });
  }

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">No expenses yet. Add one above!</div>';
    totalDisplay.textContent = "Total: ₹0.00";
    return;
  }

  let total = 0;
  let html = "";

  for (let i = 0; i < filtered.length; i++) {
    const exp = filtered[i];
    total += exp.amount;
    html +=
      '<div class="expense-item">' +
        '<div class="expense-info">' +
          '<span class="expense-desc">' + escapeHtml(exp.description) + "</span>" +
          '<span class="expense-meta">' + escapeHtml(exp.category) + " &middot; " + exp.date + "</span>" +
        "</div>" +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span class="expense-amount">-₹' + exp.amount.toFixed(2) + "</span>" +
          '<button class="delete-btn" data-id="' + exp.id + '">&times;</button>' +
        "</div>" +
      "</div>";
  }

  list.innerHTML = html;
  totalDisplay.textContent = "Total: ₹" + total.toFixed(2);

  const deleteButtons = list.querySelectorAll(".delete-btn");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      deleteExpense(id);
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function addExpense(description, amount, category, date) {
  const expense = {
    id: Date.now().toString(),
    description: description,
    amount: amount,
    category: category,
    date: date,
  };
  expenses.push(expense);
  saveExpenses();
  render();
}

function deleteExpense(id) {
  expenses = expenses.filter(function (e) {
    return e.id !== id;
  });
  saveExpenses();
  render();
}

document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!description || !amount || !category || !date) {
    alert("Please fill in all fields.");
    return;
  }

  if (amount < 100) {
    alert("Minimum amount is ₹100.");
    return;
  }

  addExpense(description, amount, category, date);

  this.reset();
  document.getElementById("date").value = getToday();
});

document.getElementById("filter-category").addEventListener("change", function () {
  render();
});

document.getElementById("date").value = getToday();

loadExpenses();
render();
