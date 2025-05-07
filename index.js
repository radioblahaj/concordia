import { WebClient } from '@slack/web-api';
import pkg from '@slack/bolt';
import dotenv from 'dotenv';
import { getPrisma } from './getPrisma.js';
import { getAllMessages } from './getAllMessages.js';
import cron from 'node-cron';

const { App } = pkg;
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

app.event('team_join', async ({ event, client, logger }) => {
    try {
        const messageCount = await getAllMessages(event.user)

        const createUser = await prisma.Users.upsert({
            where: {
                id: event.user
            },
            update: {
                message_count: messageCount
            },
            create: {
                id: event.user,
                join_date: Date.now()
            }
        })

        console.log(createUser)
    } catch (e) {
        console.log(e)
    }
});


(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
    console.log("Bolt app is running")
})();






