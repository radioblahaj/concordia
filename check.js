import dotenv from 'dotenv';
import { getPrisma } from './getPrisma.js';
import { getAllMessages } from './getAllMessages.js';
import cron from 'node-cron';

async function check() {
    dotenv.config();
    const prisma = getPrisma();
    
    cron.schedule('* * * * * *', async () => {
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
                const setApproved =  await prisma.Users.update({
                    where: {
                        id: element.id
                    },
                    data: {
                        Approved: true
                    }
                })
                console.log(setApproved)
            // const webhookResponse = await fetch("https://hooks.slack.com/services/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", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         text: `:yay: <@${element.id}> has posted 200 messages in 2 weeks! DM them to get their address & send them *Welcome Package (postcard + stickers)*`,
            //     }),
            // });
            console.log('Webhook status:', webhookResponse.status);
        }
        if (element.Approved) {
            console.log("hii")
        }
    
    
        }
    });
    
    console.log(':zap: Bolt app is running!');
}

check()