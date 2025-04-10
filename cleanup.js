const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((res) => rl.question(q, res));

const deleteIfExists = (p) => {
  if (fs.existsSync(p)) {
    if (fs.lstatSync(p).isDirectory()) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`🗑️  Ordner gelöscht: ${p}`);
    } else {
      fs.unlinkSync(p);
      console.log(`🗑️  Datei gelöscht: ${p}`);
    }
  }
};

const moveToArchive = (filePath, archivePath) => {
  if (!fs.existsSync(archivePath)) fs.mkdirSync(archivePath);
  const target = path.join(archivePath, path.basename(filePath));
  fs.renameSync(filePath, target);
  console.log(`📦 Verschoben: ${filePath} → ${target}`);
};

(async () => {
  const cwd = process.cwd();
  const archiveDir = path.join(cwd, "__archive");

  console.log("🧹 Starte Projekt-Aufräumung...\n");

  // Alle node_modules finden
  const walk = (dir, list = []) => {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        if (file === "node_modules" && dir !== cwd) list.push(fullPath);
        else walk(fullPath, list);
      }
    });
    return list;
  };

  const modules = walk(cwd);
  if (modules.length) {
    const answer = await ask(
      `Es wurden ${modules.length} zusätzliche node_modules gefunden. Löschen? (j/n): `
    );
    if (answer.toLowerCase() === "j") {
      modules.forEach(deleteIfExists);
    }
  }

  // Dateien im Root prüfen
  const filesToCheck = [
    "main.js",
    "checkout.js",
    "index.html",
    "index.ts",
    "bfg-1.15.0.jar",
  ];

  for (const file of filesToCheck) {
    const fullPath = path.join(cwd, file);
    if (fs.existsSync(fullPath)) {
      const answer = await ask(`"${file}" gefunden. Löschen? (j/n): `);
      if (answer.toLowerCase() === "j") deleteIfExists(fullPath);
    }
  }

  // Nicht zuordenbare Dateien ins Archiv
  const rootFiles = fs
    .readdirSync(cwd)
    .filter(
      (f) =>
        fs.lstatSync(path.join(cwd, f)).isFile() &&
        !["package.json", "README.md", "cleanup.js"].includes(f)
    );

  if (rootFiles.length) {
    const answer = await ask(
      `Sollen ${rootFiles.length} Root-Dateien ins __archive verschoben werden? (j/n): `
    );
    if (answer.toLowerCase() === "j") {
      rootFiles.forEach((f) => moveToArchive(path.join(cwd, f), archiveDir));
    }
  }

  rl.close();
})();
