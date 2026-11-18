import { apiFetch } from "../utils/api.js";
import { getToken } from "../utils/auth.js";

//Referencias a elementos del DOM
const form = document.getElementById("categoryForm");
const inputName = document.getElementById("categoryName");
const inputId = document.getElementById("categoryId");
const btnSave = document.getElementById("saveCategory");
const btnUpdate = document.getElementById("updateCategory");
const btnCancel = document.getElementById("cancelUpdate");
const list = document.getElementById("categoryList");

//Guardar una categoria
async function saveCategory() {
  const name = inputName.value.trim();
  if (!name) {
    alert("Escribe un nombre para la categoría");
    return;
  }
  try {
    const token = getToken();
    await apiFetch("/categories/new", "POST", { name }, token);
    alert("Categoría guardada correctamente");
    form.reset();
    //loadCategories();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function loadCategories() {
  try {
    const token = getToken();
    const categories = await apiFetch("/categories/list", "GET", null, token);
    list.innerHTML = "";
    categories.forEach((category) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${category.name}</span>
        <button class="edit">Editar</button>
      `;
      li.querySelector("button").addEventListener("click", () => {
        editCategory(category);
      });
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar categorías:", error.message);
    alert("No pudimos cargar las categorias");
  }
}
//ocultar botones
function editCategory(category) {
  inputId.value = category._id;
  inputName.value = category.name;
  btnSave.style.display = "none";
  btnUpdate.style.display = "inline-block";
  btnCancel.style.display = "inline-block";
}

function cancelUpdate() {
  inputId.value = "";
  btnSave.style.display = "inline-block";
  btnUpdate.style.display = "none";
  btnCancel.style.display = "none";
  form.reset();
}

async function updateCategory() {
  const id = inputId.value;
  const name = inputName.value.trim();
  try {
    const token = getToken();
    await apiFetch(`/categories/${id}`, "PUT", { name }, token);
    alert("Categoria actualizada correctamente");
    cancelUpdate();
    loadCategories();
  } catch (error) {
    console.error("Error al actualizar la categoría", error.message);
    alert("No pudimos actualizar la categoría");
  }
}

btnSave.addEventListener("click", saveCategory);
btnCancel.addEventListener("click", cancelUpdate);
btnUpdate.addEventListener("click", updateCategory);
document.addEventListener("DOMContentLoaded", loadCategories);
