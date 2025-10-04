const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 800 * 1024 * 1024, // 10 MB
  },
});

// Criar pasta uploads se não existir
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Upload de arquivo
app.post("/upload", (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "Arquivo muito grande! Limite: 800 MB" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Arquivo enviado com sucesso!" });
  });
});

// Listar arquivos
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) return res.status(500).json({ error: "Erro ao listar arquivos" });
    res.json(files);
  });
});

// Deletar arquivo
app.delete("/files/:name", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.name);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar arquivo" });
    res.json({ message: "Arquivo deletado com sucesso!" });
  });
});

app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
