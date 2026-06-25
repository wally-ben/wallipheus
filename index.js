require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");
const channelID = "C0AECK065AP"
const greetings = [
    "Hello!!",
    "Hi! :hii:",
    "Heyy ✨",
    "Yo! :ultrafastparrot:"
]

let dailyMsg = ""


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});
app.command("/wallipheus-ping", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({ 
        text: `Pong!\nLatency: ${latency}ms` 
    });
});
app.command("/wallipheus-greet", async ({ command, ack, respond }) => {
    await respond({
        text: `${greetings[Math.floor(Math.random() * greetings.length)]}`
    });
});
app.command("/wallipheus-cat", async ({ command, ack, respond }) => {
    await ack ();
    try {
        const response = await axios.get("https://catfact.ninja/fact");
            await client.chat.postMessage({text: `Cat Fact: ${response.data.fact}`}) ;
        }   catch(err) {
            await respond({text: `Failed to fetch a cat fact`});
        };
});
app.event("member_joined_channel", async ({ event, client }) => {
    if (event.channel !== channelID) {
        return;
    }
    await app.client.chat.postMessage({
        channel: event.channel,
        text: `Welcome to my cave <@${event.user}>!\n<@U09AYT4B1JB> Come say Hi!`
    });
});
app.command("/wallipheus-remind", async ({ command, ack, respond, client}) => {
    await ack ();
    const args = command.text.split(" ");
    const time = Number(args[0]);
    const message = args.slice(1).join(" ");
    if (!time || !message) {
        await respond({
            text: `Usage: '/wallipheus-remind <minutes> <message>'`
        })
        return;
    }
    await respond({
        text: `I will remind you in ${time} minutes to: ${message}!`
    });
    setTimeout( async () => {
        await app.client.chat.postMessage({
            channel: command.channel_id,
            text: `<@${command.user_id}> Reminder: ${message}`
        })
    }, time * 60000);
});
function schedule() {
    const now = new Date();
    const next = new Date();
    next.setHours(9, 0, 0, 0);
    if (next <= now) {
        next.setDate(next.getDate() + 1)
    }
    const delay = next - now
    setTimeout( async () => {
        await app.client.chat.postMessage({
            channel: channelID,
            text: `Reminder: ${dailyMsg}`
        })
        schedule()
    }, delay);
}
schedule()
app.command("/wallipheus-daily", async ({command, ack, respond}) => {
    await ack ();
    dailyMsg = command.text;
    await respond({
        text: `Daily Reminder changed to ${command.text}`
    });
});

(async () => {
    await app.start();
    console.log("bot is running!");
})();