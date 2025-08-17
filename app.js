const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Android|iPhone|iPad|iPod|Windows Phone|Mobi/i.test(userAgent);
  res.locals.isMobile = isMobile;
  next();
});

app.get("/", function (req, res) {
  const ProjectsFilePath = path.join(__dirname, "data", "projects.json");

  const ProjectsFileData = fs.readFileSync(ProjectsFilePath);
  const storedProjects = JSON.parse(ProjectsFileData);

  const SkillsFilePath = path.join(__dirname, "data", "skills.json");

  const SkillsFileData = fs.readFileSync(SkillsFilePath);
  const storedSkills = JSON.parse(SkillsFileData);


  res.render("index", { projects: storedProjects, skills: storedSkills });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
