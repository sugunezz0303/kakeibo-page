const STORAGE_KEY = "kakeiboRecords";

const form = document.querySelector(".entry-panel form");
const dateInput = document.querySelector("#date");
const itemInput = document.querySelector("#item");
const typeInput = document.querySelector("#type");
const amountInput = document.querySelector("#amount");
const totalOutput = document.querySelector(".total-panel output");
const tableBody = document.querySelector(".list-panel tbody");

function loadRecords() {
  try {
    const storedRecords = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(storedRecords) ? storedRecords : [];
  } catch {
    return [];
  }
}

function renderRecords(records) {
  tableBody.replaceChildren();

  if (records.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "登録データはありません";
    row.append(cell);
    tableBody.append(row);
  } else {
    for (const record of records) {
      const row = document.createElement("tr");
      const values = [
        record.date,
        record.item,
        record.type === "income" ? "収入" : "支出",
        new Intl.NumberFormat("ja-JP").format(record.amount),
      ];

      for (const value of values) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      }

      tableBody.append(row);
    }
  }

  const balance = records.reduce((total, record) => {
    return total + (record.type === "income" ? record.amount : -record.amount);
  }, 0);

  totalOutput.textContent = new Intl.NumberFormat("ja-JP").format(balance);
}

let records = loadRecords();
renderRecords(records);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const record = {
    date: dateInput.value,
    item: itemInput.value.trim(),
    type: typeInput.value,
    amount: Number(amountInput.value),
  };

  records = [...records, record];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  renderRecords(records);
  form.reset();
});