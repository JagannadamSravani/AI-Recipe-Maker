const API_KEY = "51948309265d403d85cb18c79b812b06";

// Search recipes
async function searchRecipes() {
  const query = document.getElementById("searchInput").value;
  if (!query) return alert("Please enter a recipe name!");

  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=${API_KEY}`
    );
    const data = await res.json();

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML = "<p class='text-gray-600'>No recipes found.</p>";
      return;
    }

    data.results.forEach((recipe) => {
      const div = document.createElement("div");
      div.classList.add("p-4", "border", "rounded-lg", "shadow", "bg-white");
      div.innerHTML = `
        <h2 class="text-xl font-bold">${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}" class="w-48 rounded mt-2">
        <button onclick="getRecipeDetails(${recipe.id})"
          class="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          View Recipe
        </button>
        <div id="recipe-${recipe.id}" class="mt-3 text-gray-700"></div>
      `;
      resultsDiv.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    alert("Error fetching recipes");
  }
}

// Get recipe details
async function getRecipeDetails(id) {
  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
    );
    const data = await res.json();

    const detailsDiv = document.getElementById(`recipe-${id}`);
    detailsDiv.innerHTML = `
      <p><strong>Ready in:</strong> ${data.readyInMinutes} minutes</p>
      <p><strong>Servings:</strong> ${data.servings}</p>
      <h3 class="font-semibold mt-2">Ingredients:</h3>
      <ul class="list-disc list-inside">
        ${data.extendedIngredients
          .map((ing) => `<li>${ing.original}</li>`)
          .join("")}
      </ul>
      <h3 class="font-semibold mt-2">Instructions:</h3>
      <p>${data.instructions || "No instructions available."}</p>
    `;
  } catch (err) {
    console.error(err);
    alert("Error fetching recipe details");
  }
}

document.getElementById("searchBtn").addEventListener("click", searchRecipes);
