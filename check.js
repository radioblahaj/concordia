import dotenv from 'dotenv';
import { getPrisma } from './getPrisma.js';
import { getAllMessages } from './getAllMessages.js';
import cron from 'node-cron';
import pkg from '@slack/bolt';


async function check() {
    const { App } = pkg;

    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING,
        appToken: process.env.SLACK_APPTOKEN,
        socketMode: true
    });

    await app.start(process.env.PORT || 3000);

    dotenv.config();
    const prisma = getPrisma();

    const data = await prisma.Users.findMany();
    console.log("hi")
    for (const element of data) {
        const messagecount = await getAllMessages(element.id)
        console.log(messagecount)
        console.log("hi")
        const updateUser = await prisma.Users.update({
            where: {
                id: element.id,
            },
            data: {
                message_count: messagecount
            },
        })
        console.log(updateUser)
        if (messagecount >= 2) {
            const setApproved = await prisma.Users.update({
                where: {
                    id: element.id
                },
                data: {
                    Approved: true
                }
            })
            console.log(setApproved)
            const webhookResponse = await fetch(process.env.SLACK_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: `:yay: <@${element.id}> has posted 200 messages (${messagecount})! DM them to get their address & send them *Welcome Package (postcard + stickers)*`,
                }),
            });
            console.log('Webhook status:', webhookResponse.status);
        }
        if (element.Approved) {
            try {
                app.client.chat.postMessage({
                    channel: "C08JD1LKYBD",
                    text: `form:`,
                })
                process.exit(0)
            } catch (e) {
                console.error(e)
                process.exit(0)

            }
        }



    }


    console.log(':zap: Bolt app is running!');
}

await check()
