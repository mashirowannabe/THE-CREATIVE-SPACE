"use strict";

const supabaseClient = window.icaSupabase;
const $ = (id) => document.getElementById(id);
const money = (value) => "Rp" + Number(value || 0).toLocaleString("id-ID");
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));
const imageUrl = (value) => typeof value === "string" && (/^https?:\/\//i.test(value) || /^\/assets\/recipes\/[a-z0-9._/-]+$/i.test(value)) ? value : "";

const state = {
  recipes: [],
  products: [],
  productByCode: {},
  user: null,
  profile: null,
  entitlements: [],
  isVip: false,
  recipeBookPurchased: false,
  monthlyPlanPurchased: false,
  budget: 120000,
  diet: "all",
  selectedDay: 0,
  showAllRecipes: false,
  authMode: "login",
  emailSignupRateLimited: false,
  weekPlan: null,
  weekItems: [],
  monthlyPlan: null,
  monthlyItems: [],
  shoppingListId: null,
  shoppingItems: [],
  currentMealFromMonthly: false
};

let meals = [];
let currentUserLoadId = null;
let heroObserver = null;
let heroTimer = null;
let heroCursor = 0;

function toast(message) {
  const el = $("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.remove("hidden");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.add("hidden"), 2800);
}

function todayIso() {
  const now = new Date();
  return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
}

function addDaysIso(dateString, amount) {
  const date = new Date(dateString + "T12:00:00");
  date.setDate(date.getDate() + amount);
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}

function mondayIso(date) {
  const d = date ? new Date(date + "T12:00:00") : new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function dateLabel(dateString, options) {
  return new Intl.DateTimeFormat("id-ID", options || {}).format(new Date(dateString + "T12:00:00"));
}

function shortDay(dateString) {
  return dateLabel(dateString, { weekday: "short" }).replace(".", "").slice(0, 3).toUpperCase();
}


function applyRecipePhoto(element, recipe) {
  if (!element || !recipe) return;
  const url = imageUrl(recipe.cover_image_url || recipe.image);
  element.classList.add("recipe-photo");
  element.style.backgroundImage = url ? 'url("' + url + '")' : "";
  element.style.backgroundRepeat = "no-repeat";
  element.style.backgroundPosition = "center";
  element.style.backgroundSize = "cover";
  element.setAttribute("role", "img");
  element.setAttribute("aria-label", recipe.title || recipe.name || "Menu IcaMeal");
}
function recipeAsMeal(recipe, plannedOn, servings) {
  return {
    id: recipe.id,
    recipe_id: recipe.id,
    planned_on: plannedOn,
    day: shortDay(plannedOn),
    date: String(new Date(plannedOn + "T12:00:00").getDate()).padStart(2, "0"),
    name: recipe.title,
    price: recipe.estimated_cost_idr || 0,
    image: recipe.cover_image_url,
    cal: recipe.calories || 0,
    protein: Number(recipe.protein_g || 0),
    carbs: Number(recipe.carbs_g || 0),
    fat: Number(recipe.fat_g || 0),
    tags: recipe.tags || [],
    description: recipe.description || "",
    access_tier: recipe.access_tier,
    servings: servings || 1
  };
}

function filteredMeals() {
  // The weekly menu itself is generated for the selected diet.
  return meals;
}

function getWeeklyRecipePool(diet = state.diet) {
  const available = state.recipes.filter((recipe) =>
    (diet === "all" || (recipe.tags || []).includes(diet)) &&
    (state.isVip || recipe.access_tier === "free") &&
    Number.isFinite(Number(recipe.estimated_cost_idr))
  );
  if (!available.length) {
    throw new Error("Belum ada menu yang cocok untuk mode " + diet + ".");
  }
  return available;
}

function chooseWeeklyRecipes(diet = state.diet, budget = state.budget) {
  const pool = getWeeklyRecipePool(diet)
    .slice()
    .sort((a, b) =>
      Number(a.estimated_cost_idr) - Number(b.estimated_cost_idr) ||
      Number(a.sort_order || 0) - Number(b.sort_order || 0)
    );

  let chosen = [];
  if (pool.length >= 7) {
    let best = null;
    const search = (startIndex, needed, total, selected) => {
      if (needed === 0) {
        if (total <= budget && (!best || total > best.total)) {
          best = { recipes: selected.slice(), total };
        }
        return;
      }
      if (pool.length - startIndex < needed) return;

      for (let i = startIndex; i <= pool.length - needed; i++) {
        const cost = Number(pool[i].estimated_cost_idr || 0);
        if (total + cost > budget) continue;
        selected.push(pool[i]);
        search(i + 1, needed - 1, total + cost, selected);
        selected.pop();
      }
    };

    search(0, 7, 0, []);
    chosen = best ? best.recipes : pool.slice(0, 7);
  } else {
    // Keep every available recipe in the week, then repeat the cheapest
    // options to fill seven days. The UI will expose the minimum over-budget.
    chosen = pool.slice();
    while (chosen.length < 7) chosen.push(pool[(chosen.length - pool.length) % pool.length]);
  }

  // Stable day ordering, independent from the price-search order.
  chosen.sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
  return chosen;
}

function buildWeeklyPlanRows(planId, startsOn, diet = state.diet, budget = state.budget, offset = 0) {
  const chosen = chooseWeeklyRecipes(diet, budget);
  const shift = ((offset % chosen.length) + chosen.length) % chosen.length;
  const rotated = chosen.slice(shift).concat(chosen.slice(0, shift));
  return rotated.map((recipe, index) => ({
    meal_plan_id: planId,
    recipe_id: recipe.id,
    planned_on: addDaysIso(startsOn, index),
    meal_slot: "main",
    servings: 1
  }));
}

function setWeeklyItems(items) {
  state.weekItems = items || [];
  meals = state.weekItems.map((item) => {
    const recipe = state.recipes.find((entry) => entry.id === item.recipe_id);
    return recipe ? recipeAsMeal(recipe, item.planned_on, item.servings) : null;
  }).filter(Boolean);
}

function estimate() {
  return meals.reduce((total, meal) =>
    total + Number(meal.price || 0) * Number(meal.servings || 1), 0
  );
}

function getBudgetSummary() {
  const total = estimate();
  const remaining = state.budget - total;
  return {
    total,
    remaining,
    withinBudget: remaining >= 0,
    shortfall: Math.max(0, -remaining)
  };
}

function hasActiveEntitlement(code) {
  const now = Date.now();
  return state.entitlements.some((entitlement) =>
    entitlement.entitlement_code === code &&
    entitlement.status === "active" &&
    new Date(entitlement.starts_at).getTime() <= now &&
    (!entitlement.expires_at || new Date(entitlement.expires_at).getTime() > now)
  );
}

function syncEntitlementFlags() {
  state.isVip = hasActiveEntitlement("membership");
  state.recipeBookPurchased = hasActiveEntitlement("recipe_book");
  state.monthlyPlanPurchased = hasActiveEntitlement("monthly_meal_plan");
}

function renderBudget() {
  const summary = getBudgetSummary();
  $("budgetInput").value = state.budget;
  $("budgetRange").value = state.budget;
  $("estimatedCost").textContent = money(summary.total);
  $("budgetAvailable").textContent = money(state.budget);
  $("budgetRemaining").textContent = money(summary.remaining);
  $("budgetMeter").style.width = Math.min(100, (summary.total / Math.max(1, state.budget)) * 100) + "%";

  if (summary.withinBudget) {
    $("budgetStatus").textContent = "✓ Total 7 menu sesuai anggaran";
  } else {
    $("budgetStatus").textContent = "⚠ Menu termurah 7 hari masih kurang " + money(summary.shortfall) +
      " · minimum " + money(summary.total);
  }
  $("budgetStatus").classList.toggle("over", !summary.withinBudget);
}

function renderPlanner() {
  const list = filteredMeals();
  $("weekGrid").innerHTML = list.map((meal) => {
    const index = meals.indexOf(meal);
    const locked = index >= 3 && !state.isVip;
    return '<button class="day-card ' + (index === state.selectedDay ? "selected " : "") + (locked ? "locked" : "") + '" data-day="' + index + '">' +
      '<div class="day-top"><span>' + escapeHtml(meal.day) + '</span><b>' + escapeHtml(meal.date) + '</b></div>' +
      '<div class="recipe-photo day-card-image" data-meal-photo="' + escapeHtml(meal.id) + '"></div>' +
      '<h3>' + (locked ? "Menu premium" : escapeHtml(meal.name)) + '</h3>' +
      '<span class="day-price">' + (locked ? "GOOD FOOD CLUB" : money(meal.price)) + '</span>' +
      (locked ? '<span class="lock-label">🔒 PREMIUM MENU</span>' : "") +
      '</button>';
  }).join("");

  $("weekGrid").querySelectorAll("[data-day]").forEach((button) => {
    button.addEventListener("click", () => selectDay(Number(button.dataset.day)));
  });
  $("weekGrid").querySelectorAll("[data-meal-photo]").forEach((photo) => {
    const recipe = state.recipes.find((item) => item.id === photo.dataset.mealPhoto);
    if (recipe) applyRecipePhoto(photo, recipe);
  });
  $("weeklyLockedNotice").classList.toggle("hidden", state.isVip);
}

function showMealDetail(meal, dayCaption, fromMonthly) {
  state.currentMealFromMonthly = Boolean(fromMonthly);
  applyRecipePhoto($("detailImage"), state.recipes.find((recipe) => recipe.id === meal.recipe_id) || meal);
  $("detailDay").textContent = dayCaption;
  $("detailTitle").textContent = meal.name;
  $("detailDescription").textContent = meal.description || "Menu sederhana dengan bahan yang mudah ditemukan.";
  $("macroCalories").textContent = meal.cal || 0;
  $("macroProtein").textContent = (meal.protein || 0) + "g";
  $("macroCarbs").textContent = (meal.carbs || 0) + "g";
  $("macroFat").textContent = (meal.fat || 0) + "g";
  $("detailPrice").textContent = money(meal.price);
  $("detailRecipe").onclick = () => openRecipe(meal.id, { fromMonthly: Boolean(fromMonthly) });
}

function selectDay(index) {
  const meal = meals[index];
  if (!meal) return;
  if (index >= 3 && !state.isVip) {
    openModal("subscriptionModal");
    return;
  }
  state.selectedDay = index;
  renderPlanner();
  const month = dateLabel(meal.planned_on, { month: "short" }).toUpperCase();
  showMealDetail(meal, meal.day + " · " + meal.date + " " + month, false);
}

function initHeroMotion() {
  const stage = document.querySelector(".hero-motion-stage");
  if (!stage || !state.recipes.length) return;
  const cards = [...stage.querySelectorAll("[data-hero-food]")];

  const paint = () => {
    cards.forEach((img, index) => {
      const recipe = state.recipes[(heroCursor + index * 2) % state.recipes.length];
      img.classList.add("is-changing");
      window.setTimeout(() => {
        applyRecipePhoto(img, recipe);
        img.classList.remove("is-changing");
      }, 180);
    });
    $("heroFoodCaption").textContent = state.recipes[heroCursor % state.recipes.length].title;
    heroCursor = (heroCursor + 1) % state.recipes.length;
  };

  paint();
  const start = () => {
    if (heroTimer || document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    heroTimer = window.setInterval(paint, 4600);
  };
  const stop = () => {
    if (heroTimer) {
      clearInterval(heroTimer);
      heroTimer = null;
    }
  };

  if (heroObserver) heroObserver.disconnect();
  heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting ? start() : stop());
  }, { threshold: 0.12 });
  heroObserver.observe(stage);
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
}

function renderRecipes() {
  const allRecipes = state.recipes;
  const visibleRecipes = state.showAllRecipes ? allRecipes : allRecipes.slice(0, 10);
  const preview = $("recipeHoverPreview");
  const previewImage = $("recipeHoverImage");
  const previewLabel = $("recipeHoverLabel");

  $("recipeGrid").innerHTML = visibleRecipes.map((recipe, index) => {
    const locked = recipe.access_tier === "premium" && !state.isVip && !state.recipeBookPurchased;
    return '<button class="recipe-row ' + (locked ? "recipe-row-locked" : "") + '" type="button" data-recipe="' + recipe.id + '" data-locked="' + locked + '" data-image="' + escapeHtml(imageUrl(recipe.cover_image_url)) + '" data-name="' + escapeHtml(recipe.title) + '">' +
      '<span class="recipe-row-index">' + String(index + 1).padStart(2, "0") + '</span>' +
      '<span class="recipe-row-title">' + (locked ? "Resep premium" : escapeHtml(recipe.title)) + '</span>' +
      '<span class="recipe-row-meta">' + (locked ? "AKSES TERBATAS" : ((recipe.prep_time_minutes || 20) + " MENIT · MUDAH")) + '</span>' +
      '<span class="recipe-row-price">' + (locked ? "🔒 TERKUNCI" : money(recipe.estimated_cost_idr)) + '</span>' +
      '<span class="recipe-row-arrow">' + (locked ? "🔒" : "↗") + '</span></button>';
  }).join("");

  const movePreview = (event) => {
    preview.style.left = Math.max(12, Math.min(window.innerWidth - 260, event.clientX + 24)) + "px";
    preview.style.top = Math.max(16, Math.min(window.innerHeight - 205, event.clientY - 90)) + "px";
  };
  const hidePreview = () => preview.classList.remove("visible");

  $("recipeGrid").querySelectorAll("[data-recipe]").forEach((row) => {
    if (row.dataset.locked !== "true") {
      row.addEventListener("mouseenter", (event) => {
        const recipe = state.recipes.find((item) => item.id === row.dataset.recipe);
        if (recipe) applyRecipePhoto(previewImage, recipe);
        previewLabel.textContent = row.dataset.name;
        preview.classList.add("visible");
        movePreview(event);
      });
      row.addEventListener("mousemove", movePreview);
      row.addEventListener("mouseleave", hidePreview);
      row.addEventListener("focus", () => {
        const recipe = state.recipes.find((item) => item.id === row.dataset.recipe);
        if (recipe) applyRecipePhoto(previewImage, recipe);
        previewLabel.textContent = row.dataset.name;
        const rect = row.getBoundingClientRect();
        preview.style.left = Math.max(12, Math.min(window.innerWidth - 260, rect.right + 18)) + "px";
        preview.style.top = Math.max(16, Math.min(window.innerHeight - 205, rect.top - 70)) + "px";
        preview.classList.add("visible");
      });
      row.addEventListener("blur", hidePreview);
    }
    row.addEventListener("click", () => {
      if (row.dataset.locked === "true") {
        openModal("subscriptionModal");
        return;
      }
      openRecipe(row.dataset.recipe);
    });
  });

  const toggle = $("toggleAllRecipes");
  toggle.classList.toggle("hidden", allRecipes.length <= 10);
  toggle.textContent = state.showAllRecipes ? "TAMPILKAN 10 RESEP PERTAMA ↑" : "LIHAT SEMUA RESEP ↗";
}

async function openRecipe(recipeId, options) {
  const recipe = state.recipes.find((item) => item.id === recipeId);
  if (!recipe) return;

  const canOpenPremium = state.isVip || state.recipeBookPurchased || (options?.fromMonthly && state.monthlyPlanPurchased);
  if (recipe.access_tier === "premium" && !canOpenPremium) {
    openModal("subscriptionModal");
    return;
  }

  applyRecipePhoto($("recipeModalImage"), recipe);
  $("recipeModalMeta").textContent = (recipe.prep_time_minutes || 20) + " MENIT · " + money(recipe.estimated_cost_idr) + " / PORSI";
  $("recipeTitle").textContent = recipe.title;
  $("recipeCalories").textContent = recipe.calories || 0;
  $("recipeProtein").textContent = (recipe.protein_g || 0) + "g";
  $("recipeCarbs").textContent = (recipe.carbs_g || 0) + "g";
  $("recipeFat").textContent = (recipe.fat_g || 0) + "g";
  $("recipeIngredients").innerHTML = "<li>Memuat bahan...</li>";
  $("recipeSteps").innerHTML = "<li>Memuat cara memasak...</li>";
  openModal("recipeModal");

  const [ingredientsResult, stepsResult] = await Promise.all([
    supabaseClient.from("recipe_ingredients")
      .select("quantity,unit,note,sort_order,ingredients(name,category)")
      .eq("recipe_id", recipeId)
      .order("sort_order"),
    supabaseClient.from("recipe_steps")
      .select("step_number,instruction")
      .eq("recipe_id", recipeId)
      .order("step_number")
  ]);

  if (ingredientsResult.error || stepsResult.error) {
    console.error("Recipe detail request failed:", ingredientsResult.error || stepsResult.error);
    toast("Detail resep belum bisa dimuat. Periksa akses paket atau koneksi.");
    $("recipeIngredients").innerHTML = "<li>Detail bahan tidak tersedia.</li>";
    $("recipeSteps").innerHTML = "<li>Detail memasak tidak tersedia.</li>";
    return;
  }

  const ingredientRows = ingredientsResult.data || [];
  const stepRows = stepsResult.data || [];
  $("recipeIngredients").innerHTML = ingredientRows.length
    ? ingredientRows.map((row) => {
        const ingredient = Array.isArray(row.ingredients) ? row.ingredients[0] : row.ingredients;
        const name = ingredient?.name || row.note || "Bahan";
        return "<li>" + escapeHtml(name) + " · " + Number(row.quantity).toLocaleString("id-ID") + " " + escapeHtml(row.unit) +
          (row.note ? " (" + escapeHtml(row.note) + ")" : "") + "</li>";
      }).join("")
    : "<li>Belum ada data bahan.</li>";
  $("recipeSteps").innerHTML = stepRows.length
    ? stepRows.map((row) => "<li>" + escapeHtml(row.instruction) + "</li>").join("")
    : "<li>Belum ada langkah memasak.</li>";
}

function categoryLabel(category) {
  return ({
    protein: "Protein",
    carbohydrate: "Karbohidrat",
    vegetable: "Sayuran",
    seasoning: "Bumbu",
    other: "Lainnya"
  })[category] || "Lainnya";
}

function aggregateIngredients(recipeItems, recipeIngredientRows) {
  const recipeServings = new Map(recipeItems.map((item) => [item.recipe_id, Number(item.servings || 1)]));
  const grouped = new Map();

  (recipeIngredientRows || []).forEach((row) => {
    const ingredient = Array.isArray(row.ingredients) ? row.ingredients[0] : row.ingredients;
    if (!ingredient) return;
    const key = row.ingredient_id;
    const current = grouped.get(key) || {
      id: key,
      ingredient_id: row.ingredient_id,
      name: ingredient.name,
      category: ingredient.category,
      quantity: 0,
      unit: row.unit,
      is_checked: false
    };
    if (current.unit !== row.unit) {
      throw new Error("Satuan bahan " + ingredient.name + " belum konsisten. Samakan satuannya di data resep.");
    }
    current.quantity += Number(row.quantity || 0) * (recipeServings.get(row.recipe_id) || 1);
    grouped.set(key, current);
  });

  return [...grouped.values()].sort((a, b) =>
    categoryLabel(a.category).localeCompare(categoryLabel(b.category), "id") ||
    a.name.localeCompare(b.name, "id")
  );
}

async function getIngredientRows(recipeItems) {
  const recipeIds = [...new Set(recipeItems.map((item) => item.recipe_id).filter(Boolean))];
  if (!recipeIds.length) return [];
  const { data, error } = await supabaseClient.from("recipe_ingredients")
    .select("recipe_id,ingredient_id,quantity,unit,ingredients(name,category)")
    .in("recipe_id", recipeIds)
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

async function buildShoppingItems(recipeItems) {
  const rows = await getIngredientRows(recipeItems);
  return aggregateIngredients(recipeItems, rows);
}

async function loadOrCreateShoppingList() {
  state.shoppingListId = null;
  state.shoppingItems = [];

  if (!state.user || !state.weekPlan) {
    const guestItems = meals.map((meal) => ({ recipe_id: meal.id, servings: meal.servings || 1 }));
    state.shoppingItems = await buildShoppingItems(guestItems);
    renderShopping();
    return;
  }

  const weekStart = state.weekPlan.starts_on;
  const { data: existingList, error: listError } = await supabaseClient.from("shopping_lists")
    .select("id")
    .eq("user_id", state.user.id)
    .eq("week_start", weekStart)
    .maybeSingle();
  if (listError) throw listError;

  let list = existingList;
  if (!list) {
    const { data, error } = await supabaseClient.from("shopping_lists")
      .insert({
        user_id: state.user.id,
        meal_plan_id: state.weekPlan.id,
        name: "Daftar belanja mingguan",
        week_start: weekStart
      })
      .select("id")
      .single();
    if (error) throw error;
    list = data;
  }
  state.shoppingListId = list.id;

  const { data: currentRows, error: rowsError } = await supabaseClient.from("shopping_list_items")
    .select("id,ingredient_id,custom_name,quantity,unit,category,is_checked")
    .eq("shopping_list_id", list.id)
    .order("created_at");
  if (rowsError) throw rowsError;

  const generated = await buildShoppingItems(state.weekItems.map((item) => ({
    recipe_id: item.recipe_id,
    servings: item.servings || 1
  })));

  const oldRows = currentRows || [];
  const oldByKey = new Map(oldRows
    .filter((row) => row.ingredient_id)
    .map((row) => [row.ingredient_id, row]));
  const currentMatches = oldRows.length === generated.length &&
    generated.every((item) => {
      const old = oldByKey.get(item.ingredient_id);
      return old &&
        Math.abs(Number(old.quantity || 0) - Number(item.quantity || 0)) < 0.001 &&
        old.unit === item.unit &&
        old.category === item.category;
    });

  let rows = oldRows;
  if (!currentMatches) {
    if (oldRows.length) {
      const removed = await supabaseClient.from("shopping_list_items")
        .delete()
        .eq("shopping_list_id", list.id);
      if (removed.error) throw removed.error;
    }

    if (generated.length) {
      const inserts = generated.map((item) => {
        const previous = oldByKey.get(item.ingredient_id);
        return {
          shopping_list_id: list.id,
          ingredient_id: item.ingredient_id,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          is_checked: previous ? Boolean(previous.is_checked) : false
        };
      });
      const inserted = await supabaseClient.from("shopping_list_items").insert(inserts);
      if (inserted.error) throw inserted.error;
    }

    const refreshed = await supabaseClient.from("shopping_list_items")
      .select("id,ingredient_id,custom_name,quantity,unit,category,is_checked")
      .eq("shopping_list_id", list.id)
      .order("created_at");
    if (refreshed.error) throw refreshed.error;
    rows = refreshed.data || [];
  }

  state.shoppingItems = (rows || []).map((row) => ({
    id: row.id,
    ingredient_id: row.ingredient_id,
    name: row.custom_name || "Bahan",
    category: row.category || "other",
    quantity: Number(row.quantity || 0),
    unit: row.unit || "",
    is_checked: row.is_checked
  }));

  if (state.shoppingItems.length) {
    const ingredientIds = state.shoppingItems.map((item) => item.ingredient_id).filter(Boolean);
    if (ingredientIds.length) {
      const { data: names, error } = await supabaseClient.from("ingredients")
        .select("id,name")
        .in("id", ingredientIds);
      if (!error) {
        const nameById = new Map((names || []).map((item) => [item.id, item.name]));
        state.shoppingItems.forEach((item) => {
          if (item.ingredient_id && nameById.has(item.ingredient_id)) item.name = nameById.get(item.ingredient_id);
        });
      }
    }
  }

  renderShopping();
}

function renderShopping() {
  const categories = ["protein", "carbohydrate", "vegetable", "seasoning", "other"];
  const items = state.shoppingItems || [];
  const checked = items.filter((item) => item.is_checked).length;

  $("shoppingItems").innerHTML = categories.map((category) => {
    const categoryItems = items.filter((item) => item.category === category);
    if (!categoryItems.length) return "";
    return '<div class="shopping-group"><h4>' + categoryLabel(category) + '</h4><div class="shopping-group-items">' +
      categoryItems.map((item) => '<label class="shopping-item ' + (item.is_checked ? "checked" : "") + '">' +
        '<input type="checkbox" data-shop="' + escapeHtml(item.id) + '" ' + (item.is_checked ? "checked" : "") + '>' +
        '<span>' + escapeHtml(item.name) + '</span>' +
        '<small>' + Number(item.quantity).toLocaleString("id-ID") + " " + escapeHtml(item.unit) + '</small></label>'
      ).join("") + '</div></div>';
  }).join("");

  $("shoppingItems").querySelectorAll("[data-shop]").forEach((input) => {
    input.addEventListener("change", async () => {
      const item = state.shoppingItems.find((entry) => String(entry.id) === input.dataset.shop);
      if (!item) return;
      const oldValue = item.is_checked;
      item.is_checked = input.checked;
      renderShopping();
      if (state.user && state.shoppingListId && typeof item.id === "string" && item.id.includes("-")) {
        const { error } = await supabaseClient.from("shopping_list_items")
          .update({ is_checked: item.is_checked })
          .eq("id", item.id)
          .eq("shopping_list_id", state.shoppingListId);
        if (error) {
          item.is_checked = oldValue;
          renderShopping();
          toast("Status belanja gagal disimpan.");
        }
      }
    });
  });

  $("shoppingCount").textContent = checked + "/" + items.length;
  $("shoppingRemaining").textContent = (items.length - checked) + " BAHAN TERSISA";
  $("shoppingProgress").style.width = (items.length ? checked / items.length * 100 : 0) + "%";
}

async function rebuildShoppingList() {
  if (state.user && state.shoppingListId) {
    const { error } = await supabaseClient.from("shopping_list_items")
      .delete()
      .eq("shopping_list_id", state.shoppingListId);
    if (error) {
      toast("Daftar belanja gagal diperbarui.");
      return;
    }
    const generated = await buildShoppingItems(state.weekItems.map((item) => ({
      recipe_id: item.recipe_id,
      servings: item.servings || 1
    })));
    if (generated.length) {
      const { error: insertError } = await supabaseClient.from("shopping_list_items").insert(
        generated.map((item) => ({
          shopping_list_id: state.shoppingListId,
          ingredient_id: item.ingredient_id,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category
        }))
      );
      if (insertError) {
        toast("Bahan baru gagal disimpan.");
        return;
      }
    }
    await loadOrCreateShoppingList();
  } else {
    state.shoppingItems = await buildShoppingItems(meals.map((meal) => ({ recipe_id: meal.id, servings: 1 })));
    renderShopping();
  }
}

async function loadProducts() {
  const { data, error } = await supabaseClient.from("products")
    .select("code,name,price_idr,duration_days,is_active,display_order")
    .eq("is_active", true)
    .order("display_order");
  if (error) throw error;
  state.products = data || [];
  state.productByCode = Object.fromEntries(state.products.map((product) => [product.code, product]));
  const priceText = (code) => state.productByCode[code] ? money(state.productByCode[code].price_idr) : "";

  document.querySelectorAll('[data-plan="monthly"] b').forEach((label) => {
    if (priceText("good_food_club_monthly")) label.textContent = priceText("good_food_club_monthly");
  });

  const recipeBookOffer = $("buyRecipeBook")?.closest(".single-recipe-offer");
  if (recipeBookOffer && priceText("recipe_book_30")) recipeBookOffer.querySelector(".single-recipe-bottom b").innerHTML = priceText("recipe_book_30") + ' <small>/ sekali beli</small>';
  const monthlyOffer = $("buyMonthlyPlanFromOffers")?.closest(".single-recipe-offer");
  if (monthlyOffer && priceText("meal_plan_30_days")) monthlyOffer.querySelector(".single-recipe-bottom b").innerHTML = priceText("meal_plan_30_days") + ' <small>/ sekali beli</small>';
  if (priceText("meal_plan_30_days")) $("monthlyPlanModal").querySelector(".monthly-purchase-price b").textContent = priceText("meal_plan_30_days");
}

async function ensureWeeklyPlan() {
  const start = mondayIso();
  const end = addDaysIso(start, 6);
  const { data: plan, error: planError } = await supabaseClient.from("meal_plans")
    .upsert({
      user_id: state.user.id,
      plan_type: "weekly",
      title: "Rencana makan mingguan",
      starts_on: start,
      ends_on: end,
      weekly_budget_idr: state.budget,
      diet_preference: state.diet
    }, { onConflict: "user_id,plan_type,starts_on" })
    .select("id,user_id,plan_type,starts_on,ends_on,weekly_budget_idr,diet_preference")
    .single();
  if (planError) throw planError;
  state.weekPlan = plan;

  const { data: currentItems, error: itemsError } = await supabaseClient.from("meal_plan_items")
    .select("id,meal_plan_id,recipe_id,planned_on,meal_slot,servings")
    .eq("meal_plan_id", plan.id)
    .order("planned_on");
  if (itemsError) throw itemsError;

  const expected = buildWeeklyPlanRows(plan.id, start, state.diet, state.budget);
  const current = currentItems || [];
  const needsSync = current.length !== 7 || expected.some((expectedItem, index) =>
    !current[index] ||
    current[index].planned_on !== expectedItem.planned_on ||
    current[index].recipe_id !== expectedItem.recipe_id ||
    current[index].meal_slot !== expectedItem.meal_slot
  );

  let items = current;
  if (needsSync) {
    const saved = await supabaseClient.from("meal_plan_items")
      .upsert(expected, { onConflict: "meal_plan_id,planned_on,meal_slot" })
      .select("id,meal_plan_id,recipe_id,planned_on,meal_slot,servings")
      .order("planned_on");
    if (saved.error) throw saved.error;
    items = saved.data || [];
  }

  setWeeklyItems(items);
}

async function ensureMonthlyPlan() {
  if (!state.user || (!state.isVip && !state.monthlyPlanPurchased)) {
    state.monthlyPlan = null;
    state.monthlyItems = [];
    return;
  }

  const today = todayIso();
  const { data: activePlan, error: activePlanError } = await supabaseClient.from("meal_plans")
    .select("id,starts_on,ends_on")
    .eq("user_id", state.user.id)
    .eq("plan_type", "monthly")
    .lte("starts_on", today)
    .gte("ends_on", today)
    .order("starts_on", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (activePlanError) throw activePlanError;
  const start = activePlan?.starts_on || today;
  const end = activePlan?.ends_on || addDaysIso(start, 29);
  const { data: plan, error: planError } = await supabaseClient.from("meal_plans")
    .upsert({
      user_id: state.user.id,
      plan_type: "monthly",
      title: "Meal Plan Bulanan · 30 Hari",
      starts_on: start,
      ends_on: end,
      weekly_budget_idr: state.budget,
      diet_preference: state.diet
    }, { onConflict: "user_id,plan_type,starts_on" })
    .select("id,user_id,plan_type,starts_on,ends_on")
    .single();
  if (planError) throw planError;
  state.monthlyPlan = plan;

  let { data: items, error: itemsError } = await supabaseClient.from("meal_plan_items")
    .select("id,meal_plan_id,recipe_id,planned_on,meal_slot,servings")
    .eq("meal_plan_id", plan.id)
    .order("planned_on");
  if (itemsError) throw itemsError;

  if (!items || !items.length) {
    const generated = Array.from({ length: 30 }, (_, index) => ({
      meal_plan_id: plan.id,
      recipe_id: state.recipes[index % state.recipes.length].id,
      planned_on: addDaysIso(start, index),
      meal_slot: "main",
      servings: 1
    }));
    const inserted = await supabaseClient.from("meal_plan_items").upsert(generated, {
      onConflict: "meal_plan_id,planned_on,meal_slot"
    });
    if (inserted.error) throw inserted.error;
    const reloaded = await supabaseClient.from("meal_plan_items")
      .select("id,meal_plan_id,recipe_id,planned_on,meal_slot,servings")
      .eq("meal_plan_id", plan.id)
      .order("planned_on");
    if (reloaded.error) throw reloaded.error;
    items = reloaded.data || [];
  }
  state.monthlyItems = items || [];
}

function renderMonthlyCalendar() {
  const canView = state.isVip || state.monthlyPlanPurchased;
  const monthItems = state.monthlyItems || [];
  const start = state.monthlyPlan?.starts_on || todayIso();
  const firstDate = new Date(start + "T12:00:00");
  const offset = firstDate.getDay();
  const labels = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
  $("calendarMonthTitle").textContent = canView
    ? dateLabel(start, { day: "numeric", month: "long" }) + " – 30 hari"
    : "Meal Plan Bulanan";
  let cells = labels.map((day) => '<div class="calendar-weekday">' + day + '</div>').join("");
  for (let i = 0; i < offset; i++) cells += '<div class="calendar-empty"></div>';

  for (let day = 0; day < 30; day++) {
    const item = monthItems[day];
    const recipe = item && state.recipes.find((entry) => entry.id === item.recipe_id);
    const locked = !canView || !item || !recipe;
    cells += '<button class="calendar-day ' + (locked ? "calendar-day-locked" : "") + '" data-calendar-day="' + day + '">' +
      '<span>' + (day + 1) + '</span>' +
      '<b>' + (locked ? "Menu terkunci" : escapeHtml(recipe.title)) + '</b>' +
      '<small>' + (locked ? "AKSES BULANAN" : money(recipe.estimated_cost_idr)) + '</small></button>';
  }

  $("monthlyCalendar").innerHTML = cells;
  $("monthlyCalendar").querySelectorAll("[data-calendar-day]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canView) {
        openModal("monthlyPlanModal");
        return;
      }
      const dayIndex = Number(button.dataset.calendarDay);
      const item = monthItems[dayIndex];
      const recipe = item && state.recipes.find((entry) => entry.id === item.recipe_id);
      if (!recipe) return;
      const meal = recipeAsMeal(recipe, item.planned_on, item.servings);
      showMealDetail(meal, "HARI KE-" + (dayIndex + 1) + " · " + dateLabel(item.planned_on, { day: "numeric", month: "long" }).toUpperCase(), true);
    });
  });

  $("monthlyPlanLocked").classList.toggle("hidden", canView);
  $("monthlyCalendar").classList.toggle("calendar-blurred", !canView);
}

function showMonthly() {
  if (!state.isVip && !state.monthlyPlanPurchased) {
    openModal("monthlyPlanModal");
    return;
  }
  $("weekGrid").classList.add("hidden");
  $("monthlyCalendarWrap").classList.remove("hidden");
  $("showMonthlyPlan").classList.add("hidden");
  renderMonthlyCalendar();
}

function showWeekly() {
  $("weekGrid").classList.remove("hidden");
  $("monthlyCalendarWrap").classList.add("hidden");
  $("showMonthlyPlan").classList.remove("hidden");
}

async function loadProfileAndEntitlements(user) {
  let { data: profile, error: profileError } = await supabaseClient.from("profiles")
    .select("id,full_name,avatar_url,weekly_budget_idr,diet_preference")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) {
    const created = await supabaseClient.from("profiles").upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || (user.email || "").split("@")[0] || "Member"
    }).select("id,full_name,avatar_url,weekly_budget_idr,diet_preference").single();
    if (created.error) throw created.error;
    profile = created.data;
  }

  const { data: entitlements, error: entitlementError } = await supabaseClient.from("user_entitlements")
    .select("entitlement_code,status,starts_at,expires_at")
    .eq("user_id", user.id);
  if (entitlementError) throw entitlementError;

  state.profile = profile;
  state.entitlements = entitlements || [];
  state.budget = Number(profile.weekly_budget_idr || 120000);
  state.diet = profile.diet_preference || "all";
  syncEntitlementFlags();
  document.querySelectorAll("[data-diet]").forEach((button) => button.classList.toggle("active", button.dataset.diet === state.diet));
}

async function loadUserData(user) {
  state.user = user;
  await loadProfileAndEntitlements(user);
  await ensureWeeklyPlan();
  await ensureMonthlyPlan();
  await loadOrCreateShoppingList();
  updateHeader();
  renderBudget();
  renderPlanner();
  renderRecipes();
  renderMonthlyCalendar();
  $("weeklyLockedNotice").classList.toggle("hidden", state.isVip);
  if (meals.length) selectDay(Math.min(state.selectedDay, meals.length - 1));
}

async function loadGuestData() {
  state.user = null;
  state.profile = null;
  state.entitlements = [];
  state.isVip = false;
  state.recipeBookPurchased = false;
  state.monthlyPlanPurchased = false;
  state.weekPlan = null;
  state.weekItems = [];
  state.monthlyPlan = null;
  state.monthlyItems = [];
  state.shoppingListId = null;
  state.budget = 120000;
  state.diet = "all";
  const start = mondayIso();
  meals = chooseWeeklyRecipes(state.diet, state.budget)
    .map((recipe, index) => recipeAsMeal(recipe, addDaysIso(start, index), 1));
  await loadOrCreateShoppingList();
  document.querySelectorAll("[data-diet]").forEach((button) => button.classList.toggle("active", button.dataset.diet === "all"));
  updateHeader();
  renderBudget();
  renderPlanner();
  renderRecipes();
  renderMonthlyCalendar();
  $("weeklyLockedNotice").classList.remove("hidden");
  if (meals.length) selectDay(0);
}

async function handleAuthSession(session) {
  const user = session?.user || null;
  if (!user) {
    if (!state.user && currentUserLoadId === null) return;
    currentUserLoadId = null;
    await loadGuestData();
    return;
  }
  if (currentUserLoadId === user.id) return;
  currentUserLoadId = user.id;
  try {
    await loadUserData(user);
    toast("Data akun berhasil dimuat.");
  } catch (error) {
    console.error("Account loading failed:", error);
    currentUserLoadId = null;
    toast("Data akun belum bisa dimuat. Coba refresh halaman.");
  }
}

function updateHeader() {
  const header = $("headerActions");
  if (!state.user) {
    header.innerHTML = '<button class="button button-quiet" data-auth="login">Masuk</button><button class="button button-small button-gold" data-auth="register">Daftar ↗</button>';
    header.querySelectorAll("[data-auth]").forEach((button) => {
      button.addEventListener("click", () => openAuth(button.dataset.auth));
    });
    return;
  }

  const name = state.profile?.full_name || state.user.user_metadata?.full_name || (state.user.email || "Member").split("@")[0];
  header.innerHTML = '<div class="profile-wrap"><button class="profile-button" id="profileButton"><span>' +
    escapeHtml(name.slice(0, 2).toUpperCase()) + '</span> Hai, ' + escapeHtml(name) +
    '⌄</button><div class="profile-menu hidden" id="profileMenu"><b>' + escapeHtml(name) +
    '</b><small>' + escapeHtml(state.user.email) + '</small><small>' +
    (state.isVip ? "THE GOOD FOOD CLUB" : state.recipeBookPurchased ? "RECIPE BOOK OWNER" : state.monthlyPlanPurchased ? "MONTHLY PLAN OWNER" : "FREE MEMBER") +
    '</small><button id="profileDetails">Profil saya</button><button id="logoutButton">Keluar</button></div></div>';
  $("profileButton").onclick = () => $("profileMenu").classList.toggle("hidden");
  $("profileDetails").onclick = () => toast("Profil " + name + " · " + state.user.email);
  $("logoutButton").onclick = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) toast("Gagal keluar. " + error.message);
  };
}

function openAuth(mode) {
  state.authMode = mode;
  $("nameField").classList.toggle("hidden", mode !== "register");
  $("authName").required = mode === "register";
  $("authTitle").textContent = mode === "login" ? "Senang melihatmu lagi." : "Mulai makan lebih baik.";
  $("authIntro").textContent = mode === "login"
    ? "Masuk dan lanjutkan rencana makanmu."
    : "Buat akun agar rencana makan dan daftar belanja tersimpan.";
  $("authSubmit").disabled = state.emailSignupRateLimited && mode === "register";
  $("authSubmit").textContent = state.emailSignupRateLimited && mode === "register"
    ? "PENDAFTARAN SEMENTARA DITUTUP"
    : mode === "login" ? "MASUK KE ICAMEAL ↗" : "BUAT AKUN ↗";

  if (state.emailSignupRateLimited && mode === "register") {
    $("authIntro").textContent = "Pendaftaran email sedang tertahan karena kuota email verifikasi proyek Supabase habis. Admin proyek perlu mengatur SMTP khusus sebelum pendaftaran email bisa digunakan lagi.";
  }

  $("authSwitch").innerHTML = mode === "login"
    ? 'Belum punya akun? <button type="button" data-auth-switch>Daftar sekarang</button>'
    : 'Sudah punya akun? <button type="button" data-auth-switch>Masuk</button>';
  $("authSwitch").querySelector("button").onclick = () => openAuth(mode === "login" ? "register" : "login");
  openModal("authModal");
}
async function submitAuth(event) {
  event.preventDefault();
  const button = $("authSubmit");
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  const name = state.authMode === "register" ? $("authName").value.trim() : "";
  if (password.length < 8) {
    toast("Password minimal 8 karakter.");
    return;
  }

  button.disabled = true;
  button.textContent = state.authMode === "login" ? "MEMASUKKAN..." : "MEMBUAT AKUN...";
  try {
    if (state.authMode === "register") {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;
      if (!data.session) {
        $("authIntro").textContent = "Akun berhasil dibuat. Periksa email untuk verifikasi sebelum masuk.";
        toast("Cek email untuk verifikasi akun IcaMeal.");
        return;
      }
      closeModal("authModal");
      await handleAuthSession(data.session);
      toast("Akun IcaMeal berhasil dibuat.");
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      closeModal("authModal");
      await handleAuthSession(data.session);
      toast("Selamat datang kembali.");
    }
  } catch (error) {
    const errorCode = String(error?.code || "");
    const errorMessage = String(error?.message || "");
    const emailRateLimited =
      errorCode === "over_email_send_rate_limit" ||
      /email rate limit exceeded/i.test(errorMessage);

    if (state.authMode === "register" && emailRateLimited) {
      state.emailSignupRateLimited = true;
      $("authIntro").textContent = "Pendaftaran tertahan karena layanan email bawaan Supabase mencapai batas pengiriman. Ini bukan masalah password. Admin proyek perlu mengatur Custom SMTP di Authentication → SMTP Settings, atau mematikan Confirm email sementara hanya untuk pengujian lokal.";
      toast("Kuota email verifikasi Supabase habis. Jangan kirim percobaan daftar berulang kali.");
    } else {
      toast(errorMessage || "Autentikasi gagal.");
    }
  } finally {
    const signupBlocked = state.authMode === "register" && state.emailSignupRateLimited;
    button.disabled = signupBlocked;
    button.textContent = signupBlocked
      ? "PENDAFTARAN SEMENTARA DITUTUP"
      : state.authMode === "login" ? "MASUK KE ICAMEAL ↗" : "BUAT AKUN ↗";
  }
}

async function applyDietPreference(diet) {
  if (!["all", "vegan", "protein", "hemat"].includes(diet)) return;
  const previousDiet = state.diet;
  let shoppingSyncFailed = false;
  state.diet = diet;

  try {
    const expected = state.weekPlan
      ? buildWeeklyPlanRows(state.weekPlan.id, state.weekPlan.starts_on, diet, state.budget)
      : null;

    if (state.user && state.weekPlan) {
      const profileUpdate = await supabaseClient.from("profiles")
        .update({ diet_preference: diet })
        .eq("id", state.user.id);
      if (profileUpdate.error) throw profileUpdate.error;

      const planUpdate = await supabaseClient.from("meal_plans")
        .update({ diet_preference: diet, weekly_budget_idr: state.budget })
        .eq("id", state.weekPlan.id);
      if (planUpdate.error) throw planUpdate.error;

      const saved = await supabaseClient.from("meal_plan_items")
        .upsert(expected, { onConflict: "meal_plan_id,planned_on,meal_slot" })
        .select("id,meal_plan_id,recipe_id,planned_on,meal_slot,servings")
        .order("planned_on");
      if (saved.error) throw saved.error;

      state.profile = { ...(state.profile || {}), diet_preference: diet };
      state.weekPlan = { ...state.weekPlan, diet_preference: diet };
      setWeeklyItems(saved.data || []);
      try {
        await loadOrCreateShoppingList();
      } catch (shoppingError) {
        shoppingSyncFailed = true;
        console.error("Shopping list sync after diet change failed:", shoppingError);
      }
    } else {
      const pool = chooseWeeklyRecipes(diet, state.budget);
      const start = mondayIso();
      meals = pool.map((recipe, index) => recipeAsMeal(recipe, addDaysIso(start, index), 1));
      state.weekItems = [];
      try {
        await loadOrCreateShoppingList();
      } catch (shoppingError) {
        shoppingSyncFailed = true;
        console.error("Shopping list sync after diet change failed:", shoppingError);
      }
    }

    state.selectedDay = 0;
    renderBudget();
    renderPlanner();
    if (meals.length) selectDay(0);
    const summary = getBudgetSummary();
    const successMessage = !summary.withinBudget
      ? "Mode diet diterapkan. Menu termurah membutuhkan " + money(summary.total) + " untuk 7 hari."
      : diet === "all"
        ? "Menu mingguan dan daftar belanja diperbarui."
        : "Mode " + (diet === "vegan" ? "Vegan" : diet === "protein" ? "Tinggi protein" : "Super hemat") + " diterapkan. Total 7 menu " + money(summary.total) + ".";
    toast(shoppingSyncFailed
      ? successMessage + " Daftar belanja belum tersinkron, coba refresh."
      : successMessage);
  } catch (error) {
    state.diet = previousDiet;
    document.querySelectorAll("[data-diet]").forEach((button) => {
      button.classList.toggle("active", button.dataset.diet === previousDiet);
    });
    renderBudget();
    console.error("Diet preference update failed:", error);
    toast("Mode diet gagal diterapkan: " + (error.message || "Periksa koneksi."));
  }
}

async function applyWeeklyBudget(nextBudget) {
  const budget = Math.min(500000, Math.max(50000, Math.round(Number(nextBudget) || 50000)));
  const previousBudget = state.budget;
  state.budget = budget;

  try {
    if (state.user && state.weekPlan) {
      const profileUpdate = await supabaseClient.from("profiles")
        .update({ weekly_budget_idr: budget })
        .eq("id", state.user.id);
      if (profileUpdate.error) throw profileUpdate.error;

      const planUpdate = await supabaseClient.from("meal_plans")
        .update({ weekly_budget_idr: budget })
        .eq("id", state.weekPlan.id);
      if (planUpdate.error) throw planUpdate.error;

      const generated = buildWeeklyPlanRows(state.weekPlan.id, state.weekPlan.starts_on, state.diet, budget);
      const saved = await supabaseClient.from("meal_plan_items")
        .upsert(generated, { onConflict: "meal_plan_id,planned_on,meal_slot" })
        .select("id,meal_plan_id,recipe_id,planned_on,meal_slot,servings")
        .order("planned_on");
      if (saved.error) throw saved.error;
      state.profile = { ...(state.profile || {}), weekly_budget_idr: budget };
      state.weekPlan = { ...state.weekPlan, weekly_budget_idr: budget };
      setWeeklyItems(saved.data || []);
      await loadOrCreateShoppingList();
    } else {
      const chosen = chooseWeeklyRecipes(state.diet, budget);
      const start = mondayIso();
      meals = chosen.map((recipe, index) => recipeAsMeal(recipe, addDaysIso(start, index), 1));
      state.weekItems = [];
      await loadOrCreateShoppingList();
    }

    state.selectedDay = 0;
    renderBudget();
    renderPlanner();
    if (meals.length) selectDay(0);

    const summary = getBudgetSummary();
    toast(summary.withinBudget
      ? "Menu dan daftar belanja disesuaikan dengan anggaran " + money(budget) + "."
      : "Anggaran " + money(budget) + " belum cukup. Biaya minimum 7 menu adalah " + money(summary.total) + ".");
  } catch (error) {
    state.budget = previousBudget;
    $("budgetInput").value = previousBudget;
    $("budgetRange").value = previousBudget;
    renderBudget();
    console.error("Weekly budget update failed:", error);
    toast("Anggaran gagal diterapkan: " + (error.message || "Periksa koneksi."));
  }
}

async function saveProfile(patch) {
  if (!state.user) return;
  const { error } = await supabaseClient.from("profiles").update(patch).eq("id", state.user.id);
  if (error) {
    toast("Preferensi belum berhasil disimpan.");
    return;
  }
  state.profile = { ...(state.profile || {}), ...patch };
  if (state.weekPlan) {
    await supabaseClient.from("meal_plans").update({
      weekly_budget_idr: state.budget,
      diet_preference: state.diet
    }).eq("id", state.weekPlan.id);
  }
}

async function purchaseProduct(productCode) {
  if (!state.user) {
    toast("Masuk atau daftar dulu untuk menyimpan pembelian.");
    openAuth("login");
    return;
  }
  try {
    const { data, error } = await supabaseClient.functions.invoke("demo-checkout", {
      body: { product_code: productCode }
    });
    if (error) throw error;
    if (!data?.ok) throw new Error(data?.error || "Pembelian demo gagal.");
    closeModal("subscriptionModal");
    closeModal("monthlyPlanModal");
    currentUserLoadId = null;
    const { data: sessionData } = await supabaseClient.auth.getSession();
    await handleAuthSession(sessionData.session);
    if (productCode === "meal_plan_30_days") showMonthly();
    toast("Pembelian simulasi berhasil. Akses paket sudah tersimpan di akun.");
  } catch (error) {
    console.error("Checkout failed:", error);
    toast(error.message || "Pembelian belum bisa diproses.");
  }
}

async function regenerateWeeklyPlan() {
  if (!state.recipes.length) return;
  try {
    const pool = chooseWeeklyRecipes(state.diet, state.budget);
    const currentFirst = state.weekItems[0]?.recipe_id || meals[0]?.id;
    const currentIndex = pool.findIndex((recipe) => recipe.id === currentFirst);
    const offset = currentIndex >= 0 ? (currentIndex + 1) % pool.length : 0;

    if (state.user && state.weekPlan) {
      const generated = buildWeeklyPlanRows(state.weekPlan.id, state.weekPlan.starts_on, state.diet, state.budget, offset);
      const saved = await supabaseClient.from("meal_plan_items")
        .upsert(generated, { onConflict: "meal_plan_id,planned_on,meal_slot" })
        .select("id,meal_plan_id,recipe_id,planned_on,meal_slot,servings")
        .order("planned_on");
      if (saved.error) throw saved.error;
      setWeeklyItems(saved.data || []);
      await loadOrCreateShoppingList();
    } else {
      const start = mondayIso();
      const shift = pool.length ? offset % pool.length : 0;
      const rotated = pool.slice(shift).concat(pool.slice(0, shift));
      meals = rotated.map((recipe, index) => recipeAsMeal(recipe, addDaysIso(start, index), 1));
      state.weekItems = [];
      await loadOrCreateShoppingList();
    }

    state.selectedDay = 0;
    renderBudget();
    renderPlanner();
    if (meals.length) selectDay(0);
    const summary = getBudgetSummary();
    toast(summary.withinBudget
      ? "Menu 7 hari disusun ulang, total " + money(summary.total) + "."
      : "Ini kombinasi termurah yang tersedia: " + money(summary.total) + ". Anggaran perlu ditambah " + money(summary.shortfall) + ".");
  } catch (error) {
    console.error("Weekly plan regeneration failed:", error);
    toast("Rencana mingguan gagal diperbarui: " + (error.message || "Periksa koneksi."));
  }
}

function openModal(id) {
  $(id).classList.remove("hidden");
}
function closeModal(id) {
  $(id).classList.add("hidden");
}

function bindEvents() {
  document.querySelectorAll("[data-auth]").forEach((button) => {
    button.addEventListener("click", () => openAuth(button.dataset.auth));
  });
  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.dataset.close));
  });
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeModal(backdrop.id);
    });
  });
  document.querySelectorAll("[data-subscribe]").forEach((button) => {
    button.addEventListener("click", () => openModal("subscriptionModal"));
  });
  $("authForm").addEventListener("submit", submitAuth);
  $("activateMembership").onclick = () => purchaseProduct("good_food_club_monthly");
  $("buyRecipeBook").onclick = () => purchaseProduct("recipe_book_30");
  $("buyMonthlyPlan").onclick = () => purchaseProduct("meal_plan_30_days");
  $("buyMonthlyPlanFromOffers").onclick = () => purchaseProduct("meal_plan_30_days");
  $("showMonthlyPlan").onclick = showMonthly;
  $("showWeeklyPlan").onclick = showWeekly;
  $("toggleAllRecipes").onclick = () => {
    state.showAllRecipes = !state.showAllRecipes;
    renderRecipes();
  };
  document.querySelectorAll("[data-monthly-purchase]").forEach((button) => {
    button.addEventListener("click", () => openModal("monthlyPlanModal"));
  });

  $("budgetInput").addEventListener("change", async (event) => {
    const value = Number(event.target.value) || 50000;
    await applyWeeklyBudget(value);
  });
  $("budgetRange").addEventListener("change", async (event) => {
    await applyWeeklyBudget(Number(event.target.value));
  });
  document.querySelectorAll("[data-budget]").forEach((button) => {
    button.addEventListener("click", async () => applyWeeklyBudget(Number(button.dataset.budget)));
  });
  document.querySelectorAll("[data-diet]").forEach((button) => {
    button.addEventListener("click", async () => {
      const diet = button.dataset.diet;
      document.querySelectorAll("[data-diet]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      button.disabled = true;
      await applyDietPreference(diet);
      button.disabled = false;
    });
  });
  $("regeneratePlan").onclick = regenerateWeeklyPlan;
  $("copyShopping").onclick = async () => {
    const text = state.shoppingItems.map((item) =>
      "- " + item.name + " · " + Number(item.quantity).toLocaleString("id-ID") + " " + item.unit
    ).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast("Daftar belanja berhasil disalin.");
    } catch {
      toast("Browser tidak mengizinkan akses clipboard.");
    }
  };
  $("mobileMenu").onclick = () => document.querySelector(".main-nav").classList.toggle("open");
  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => document.querySelector(".main-nav").classList.remove("open"));
  });
}

async function loadCatalog() {
  const { data, error } = await supabaseClient.from("recipes")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw error;
  state.recipes = data || [];
  if (!state.recipes.length) throw new Error("Katalog resep belum tersedia.");
}

async function initApp() {
  if (!supabaseClient) {
    toast("Supabase client tidak berhasil dimuat. Periksa koneksi CDN.");
    return;
  }

  bindEvents();

  try {
    await loadCatalog();
    await loadProducts();
    initHeroMotion();

    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError) throw sessionError;
    if (sessionData.session) {
      await handleAuthSession(sessionData.session);
    } else {
      await loadGuestData();
    }

    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
      window.setTimeout(() => handleAuthSession(session), 0);
    });
  } catch (error) {
    console.error("IcaMeal initialization failed:", error);
    toast("IcaMeal gagal memuat data. " + (error.message || "Periksa koneksi."));
  }
}

initApp();
