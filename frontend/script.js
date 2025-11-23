const API = "http://localhost:8000/tasks";  // Backend URL

async function fetchTasks() {
  try {
    const res = await fetch(API);
    const tasks = await res.json();
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(t => {
      list.innerHTML += `
        <li class="flex justify-between bg-gray-200 p-2 rounded">
          <span class="flex-1 ${t.done ? 'line-through text-gray-500' : ''}">${t.title}</span>
          <div class="flex gap-3 text-xl">
            <button onclick="toggleTask('${t.id}')" title="Mark Done" class="text-green-600 hover:text-green-800">✔</button>
            <button onclick="deleteTask('${t.id}')" title="Delete" class="text-red-600 hover:text-red-800">✘</button>
          </div>
        </li>
      `;
    });

  } catch (err) {
    console.log("Backend not running:", err);
  }
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const title = input.value.trim();
  if (!title) return;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  input.value = "";
  fetchTasks();
}

async function toggleTask(id) {
  await fetch(`${API}/${id}/toggle`, { method: "PUT" });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  fetchTasks();
}

fetchTasks();
