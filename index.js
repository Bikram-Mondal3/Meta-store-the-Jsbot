const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');

// Use environment variable for the token
const token = process.env.Token; // Make sure to set your token here

const bot = new TelegramBot(token, { polling: true });

function download_media_content(videoLink, chatId) {
    exec(`yt-dlp ${videoLink} -o video.mp4`, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            bot.sendMessage(chatId, "🚫 Failed to download the video. Please check the link and try again❗");
        } else {
            bot.sendMessage(chatId, " Your video is almost ready! ⏳ It may take a little longer, depending on your internet connection 📶");

            bot.sendVideo(chatId, 'video.mp4').then(() => {
                bot.sendMessage(chatId, 'Your video is successfully downloaded! 📥\nEnjoy 😉🥂');
                fs.unlink('video.mp4', (err) => {
                    if (err) {
                        console.error('Error deleting the file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }).catch((err) => {
                console.error('Failed to send video:', err);
            });
        }
    });
}

bot.onText(/\/start$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello!👋 Nice to meet you. I'm Meta store, your personal social media partner 😊❤️.\nJust send me an URL link and I'll download the video post for you 😉🚀");
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text && ["fb.watch", "facebook.com", "youtu.be", "youtube.com", "instagram.com", "x.com", "reddit.com", "tiktok.com"].some(keyword => text.includes(keyword))) {
        bot.sendMessage(chatId, "⏰ Please wait");
        download_media_content(text, chatId);
    }
});
