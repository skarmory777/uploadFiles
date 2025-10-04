async function loadFiles() {
  const res = await fetch("/files");
  const files = await res.json();

  const list = document.getElementById("fileList");
  list.innerHTML = "";

  files.forEach((file) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <a href="/uploads/${file}" target="_blank">${file}</a>
      <button class="btn btn-danger btn-sm" onclick="deleteFile('${file}')">Excluir</button>
    `;
    list.appendChild(li);
  });
}

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  await fetch("/upload", { method: "POST", body: formData });
  e.target.reset();
  loadFiles();
});

async function deleteFile(name) {
  await fetch(`/files/${name}`, { method: "DELETE" });
  loadFiles();
}

// Carregar lista inicial
loadFiles();
