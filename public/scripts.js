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

document.getElementById("uploadForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const fileInput = e.target.querySelector("input[type=file]");
  if (!fileInput.files.length) return;

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  const xhr = new XMLHttpRequest();
  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");

  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressBar.textContent = "0%";

  xhr.upload.addEventListener("progress", (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      progressBar.style.width = percent + "%";
      progressBar.textContent = percent + "%";
    }
  });

  xhr.open("POST", "/upload");
  xhr.onload = () => {
    if (xhr.status === 200) {
      progressBar.style.width = "100%";
      progressBar.textContent = "100%";
      loadFiles();
    } else {
      alert("Erro no upload: " + xhr.responseText);
    }
    fileInput.value = "";
    setTimeout(() => (progressContainer.style.display = "none"), 1500);
  };

  xhr.send(formData);
});

async function deleteFile(name) {
  await fetch(`/files/${name}`, { method: "DELETE" });
  loadFiles();
}

loadFiles();
