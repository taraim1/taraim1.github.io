const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const root = __dirname;
const projects = JSON.parse(fs.readFileSync(path.join(root, "data/projects.json"), "utf-8"));
const skills = JSON.parse(fs.readFileSync(path.join(root, "data/skills.json"), "utf-8"));

ejs.renderFile(path.join(root, "views/index.ejs"), { projects, skills }, {}, (err, html) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.writeFileSync(path.join(root, "docs/index.html"), html, "utf-8");
  // 옵션: public 정적 파일 복사
  if (fs.existsSync(path.join(root, "public"))) {
    copyDir(path.join(root, "public"), path.join(root, "docs"));
  }
  // Jekyll 끄기
  fs.writeFileSync(path.join(root, "docs/.nojekyll"), "", "utf-8");
  console.log("Built → docs/index.html");
});

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}