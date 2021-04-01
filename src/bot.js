const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.BOT_APIKEY, { polling: true });

const { searchUser, searchRepo } = require("./index");

bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `*Hi ${msg.from.first_name}*, Welcome to gitty bot! 🤖 \n \n`,
    { parse_mode: "Markdown" }
  );

  setTimeout(() => {
    bot.sendMessage(
      msg.chat.id,
      `What do you wanna do today🤗\n\nTo view a user's GitHub details enter the username eg. bradtraversy. \n To check for details about a repository, Hit /repo ❤️`,
      { parse_mode: "Markdown" }
    );
  }, 1000);
});

bot.on("message", async (msg) => {
  let github_user = msg.text;
  let chatId = msg.chat.id;

  if (github_user !== "/start" && github_user !== "/repo") {
    try {
      // Set Loading
      bot.sendMessage(chatId, `Searching for "${github_user}"`, {
        parse_mode: "Markdown",
      });

      const result = await searchUser(github_user);
      const {
        login,
        avatar_url,
        html_url,
        followers,
        repos_url,
        public_repos,
        name,
        // company,
        // website,
        // email,
        bio,
      } = result;
      if (!result) {
        bot.sendMessage(
          chatId,
          `Sorry, but nothing matched your search term ${github_user}. Please try again with something different.`
        );
      } else {
        bot.sendPhoto(chatId, avatar_url);
        bot.sendMessage(
          chatId,
          `Name: ${name} \nUsername: ${login} \nBio: ${bio} \nLink to GitHub profile: ${html_url} \nFollower count: ${followers} \nRepos url: ${repos_url} \nNumber of public repos: ${public_repos} \n`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
});

bot.onText(/\/repo/, async (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `To search for a repo, Use this format: \n\n create-react-app in facebook \n\n That is, you are searching for repo "create-react-app" in user account "facebook"`,
    { parse_mode: "Markdown" }
  );
});
bot.on("message", async (message) => {
  if (message === "/repo") return;
  const msg = message.text.split(" ");

  let github_repo = msg[0];
  let github_user = msg[2];
  let chatId = msg.chat.id;

  try {
    // Set Loading
    bot.sendMessage(
      chatId,
      `Searching for "${github_repo}" in ${github_user}`,
      {
        parse_mode: "Markdown",
      }
    );

    const result = await searchRepo(github_user, github_repo);
    const {
      homepage,
      name,
      owner,
      description,
      language,
      license,
      forks_count,
      subscribers_count,
      stargazers_count,
    } = result;
    const { avatar_url } = owner;
    if (!result) {
      bot.sendMessage(
        chatId,
        `Sorry, but nothing matched your search terms. Please try again with some different keywords.`
      );
    } else {
      bot.sendPhoto(chatId, avatar_url);
      bot.sendMessage(
        chatId,
        `Name: ${name} \nStars: ${stargazers_count} \nHomepage: ${homepage} \nDescription: ${description} \nLanguage: ${language} \nLicense: ${license.name} \nForks: ${forks_count} \nSubsrcibers: ${subscribers_count}`
      );
    }
  } catch (error) {
    console.error(error);
  }
});
bot.on("polling_error", (err) => console.log(err));
