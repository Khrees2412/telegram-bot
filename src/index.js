const fetch = require("node-fetch");

const GITHUB_API = "https://api.github.com";

async function searchUser(username) {
  let userDetails;
  try {
    const data = await fetch(`${GITHUB_API}/users/${username}`);
    const user = await data.json();
    userDetails = user;
  } catch (error) {
    console.error(error);
  }

  console.log(userDetails);
  return userDetails;
}

async function searchRepo(username, repo) {
  let repoDetails;
  try {
    const data = await fetch(`${GITHUB_API}/repos/${username}/${repo}`);
    const userRepo = await data.json();
    repoDetails = userRepo;
  } catch (error) {
    console.error(error);
  }

  console.log(repoDetails);
  return repoDetails;
}

module.exports = { searchUser, searchRepo };
