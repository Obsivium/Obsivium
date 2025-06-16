const fs = require("fs");
const path = require("path");

function get_repos(username) {
  const url = `https://api.github.com/users/${username}/repos`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data);
}

function get_repo_details(repo) {
  console.warn(repo);
  return `
  <tr>
    <td><a href="${repo.svn_url}"><b>${repo.name}</b></a></td>
    <td><img alt="Stars" src="https://img.shields.io/github/stars/${repo.owner.login}/${repo.name}?style=flat-square&labelColor=343b41"/></td>
    <td><img alt="Forks" src="https://img.shields.io/github/forks/${repo.owner.login}/${repo.name}?style=flat-square&labelColor=343b41"/></td>
    <td><img alt="Issues" src="https://img.shields.io/github/issues/${repo.owner.login}/${repo.name}?style=flat-square&labelColor=343b41"/></td>
    <td><img alt="Pull Requests" src="https://img.shields.io/github/issues-pr/${repo.owner.login}/${repo.name}?style=flat-square&labelColor=343b41"/></td>
    </tr>
`;
}

function change_time(data) {
  return data.replace("{{refresh_time}}", new Date().toLocaleString());
}

async function main() {
  const template = await fs.readFileSync(
    path.join(__dirname, "README_template.md"),
    "utf8",
  );
  const current = await fs.readFileSync(
    path.join(__dirname, "README.md"),
    "utf8",
  );
  const repos = await get_repos("obsivium");
  console.log(repos);
  const repoDetails = repos.map(get_repo_details).join("");
  const updatedTemplate = template.replace("{{projects}}", repoDetails),

  if (updatedTemplate != current){
    await fs.writeFileSync(path.join(__dirname, "README.md"), updatedTemplate);
  }
}

main();
