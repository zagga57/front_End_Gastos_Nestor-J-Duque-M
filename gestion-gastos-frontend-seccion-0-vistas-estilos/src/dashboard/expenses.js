import { apiFetch } from "../utils/api.js";
import { getToken } from "../utils/auth.js";
//Referencias a elementos del DOM
const form = document.getElementById("expenseForm");
const inputTitle = document.getElementById("expenseTitle");
const inputAmount = document.getElementById("expenseAmount");
const selectCategory = document.getElementById("expenseCategory");
const inputDate = document.getElementById("expenseDate");
const inputId = document.getElementById("expenseId");
const btnSave = document.getElementById("saveExpense");
const btnUpdate = document.getElementById("updateExpense");
const btnCancel = document.getElementById("cancelUpdate");
const expenseList = document.getElementById("expenseList");

//Funcion para cargar las categorias en el selector
async function loadCategories() {
  try {
    const token = getToken();
    const categories = await apiFetch("/categories/list", "GET", null, token);
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      selectCategory.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    alert("No se pudieron cargar las categorias");
  }
}

//Crear un nuevo gasto

async function saveExpense() {
  const title = inputTitle.value.trim();
  const amount = inputAmount.value.trim();
  const category = selectCategory.value;
  const date = inputDate.value;
  try {
    const token = getToken();
    await apiFetch(
      "/expenses/new",
      "POST",
      { title, amount, category, date },
      token,
    );
    alert("Gasto guardado correctamente");
    form.reset();
    loadExpenses();
  } catch (error) {
    console.error(error);
    alert("No se pudo crear el gasto");
  }
}
//mostrar los gastos

async function loadExpenses() {
  try {
    const token = getToken();
    const expenses = await apiFetch("/expenses/list", "GET", null, token);
    expenseList.innerHTML = "";
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${expense.title}--->$${expense.amount}</span>
        <button class="edit">Editar</button>
      `;
      li.querySelector("button").addEventListener("click", () => {
        editExpense(expense);
      });
      expenseList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar el gasto:", error.message);
    alert("No pudimos cargar los gastos");
  }
}

function editExpense(expense) {
  inputId.value = expense._id;
  inputTitle.value = expense.title;
  inputAmount.value = expense.amount;
  selectCategory.value = expense.category;
  inputDate.value = expense.date ? expense.date.slice(0, 10) : "";
  btnSave.style.display = "none";
  btnUpdate.style.display = "inline";
  btnCancel.style.display = "inline";
}

function cancelUpdate() {
  inputId.value = "";
  btnSave.style.display = "inline-block";
  btnUpdate.style.display = "none";
  btnCancel.style.display = "none";
  form.reset();
}

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadExpenses();
});
btnSave.addEventListener("click", saveExpense);
btnCancel.addEventListener("click", cancelUpdate);
