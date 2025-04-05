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

app.event('member_joined_channel', async ({ event, client, logger }) => {
    try {

        const getMessages = await getAllMessages(event.user)
        const messageCount = getMessages.total_count

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
    cron.schedule('59 23 * * *', async () => {
        const data = await prisma.Users.findMany();
        for (const element of data) {
            const messageCount = await getAllMessages(element.id)
            //   console.log(messageCount.total_count)
            if (messageCount.total_count > 200) {
                await prisma.Users.update({
                    where: {
                        id: element.id
                    },
                    data: {
                        messageCount: messageCount.total_count
                    }
                })
                const webhookResponse = await fetch(process.env.SLACK_WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: ` :yay: <@${element.id}> has posted 200 messages in 2 weeks! DM them to get their address & send them *Welcome Package (postcard + stickers)*`,
                    }),
                });
            }
        }
    });
    console.log(':zap: Bolt app is running!');
})();


