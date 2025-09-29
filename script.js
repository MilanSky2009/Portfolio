let players = [];
let currentPage = 1;
const rowsPerPage = 10;
let currentSort = { column: null, direction: null };

async function loadPlayers() {
  const res = await fetch("players.json");
  const data = await res.json();
  players = data.map((p) => {
    const [firstName, lastName] = p.name.split(" ");
    return {
      firstName,
      lastName,
      score: p.score,
      level: p.level,
      joinDate: p.join_date, // ✅ Corrected to match JSON key
      country: p.country,
      avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${firstName}${lastName}`
    };
  });
  renderTable(players);
}

function renderTable(data) {
  const tbody = document.querySelector("#leaderboard tbody");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const paginatedItems = data.slice(start, start + rowsPerPage);

  paginatedItems.forEach((player, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Rank">${start + index + 1}</td>
      <td data-label="Avatar"><img src="${player.avatar}" class="avatar" alt="Avatar" /></td>
      <td data-label="First Name">${player.firstName}</td>
      <td data-label="Last Name">${player.lastName}</td>
      <td data-label="Score">${player.score}</td>
      <td data-label="Level">${player.level}</td>
      <td data-label="Join Date">${player.joinDate}</td>
      <td data-label="Country">${player.country}</td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${Math.ceil(data.length / rowsPerPage)}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === Math.ceil(data.length / rowsPerPage);
}

function sortTable(column) {
  const direction = currentSort.column === column && currentSort.direction === "asc" ? "desc" : "asc";
  currentSort = { column, direction };

  players.sort((a, b) => {
    if (typeof a[column] === "number") {
      return direction === "asc" ? a[column] - b[column] : b[column] - a[column];
    }
    return direction === "asc"
      ? a[column].localeCompare(b[column])
      : b[column].localeCompare(a[column]);
  });

  document.querySelectorAll("th.sortable").forEach(th => {
    th.classList.remove("asc", "desc");
    if (th.getAttribute("data-column") === column) {
      th.classList.add(direction);
    }
  });

  currentPage = 1;
  renderTable(players);
}

document.querySelectorAll("th.sortable").forEach(th => {
  th.addEventListener("click", () => {
    const column = th.getAttribute("data-column");
    sortTable(column);
  });
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(players);
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage < Math.ceil(players.length / rowsPerPage)) {
    currentPage++;
    renderTable(players);
  }
});

loadPlayers();
