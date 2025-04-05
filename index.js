import { WebClient } from '@slack/web-api';
import pkg from '@slack/bolt';
const { App } = pkg;
import { runRedis } from './runRedis.js';
import dotenv from 'dotenv';
import { getPrisma } from './getPrisma.js';
const prisma = getPrisma();


dotenv.config();

const token = process.env.SLACK_BOT_TOKEN
const web = new WebClient(token);

// console.log(client)

    const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING,
  appToken: process.env.SLACK_APPTOKEN,
  socketMode: true
});

const channelID = "C08JD1LKYBD" 

app.event('member_joined_channel', async ({ event, client, logger }) => {
    try {
    const createUser =  await prisma.Users.create({
            data: {
                id: event.user,
                join_date: Date.now()
            }
        })
        console.log(createUser)
    } catch(e) {
        console.log(e)
    }
});



(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
    await runRedis()
    console.log(':zap: Bolt app is running!');
  })();

async function getAllMessages() {
    const formData = new FormData();
    formData.append("token", process.env.SLACK_XOXC);
    formData.append("module", "messages");
    formData.append("query", `from:<@${"U01MPHKFZ7S"}>`);
    formData.append("page", 100000);

    const response = await fetch(
        `https://hackclub.slack.com/api/search.modules.messages`,
        {
            headers: {
                accept: "*/*",
                cookie: `d=${process.env.SLACK_XOXD}`,
            },
            body: formData,
            method: "POST",
        }
    );

    const data = await response.json();
    const messageCount = data.pagination
    const achivementMet = false
    console.log(messageCount);
    if (messageCount >= 200) {
        achivementMet = true
    }
}



getAllMessages().catch(error => console.error('Error fetching messages:', error));
