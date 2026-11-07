const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Menghubungkan ke folder frontend

// Konfigurasi Bot Discord menggunakan Environment Variable dari Render
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
    console.log(`Bot berhasil login sebagai ${client.user.tag}`);
});

// Endpoint untuk kirim pesan ke Server / Channel
app.post('/api/send-server', async (req, res) => {
    const { channelId, message } = req.body;
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel) return res.status(404).json({ success: false, error: 'Channel tidak ditemukan!' });
        
        await channel.send(message);
        res.json({ success: true, message: 'Pesan berhasil dikirim ke server!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint untuk kirim pesan ke DM User
app.post('/api/send-dm', async (req, res) => {
    const { userId, message } = req.body;
    try {
        const user = await client.users.fetch(userId);
        if (!user) return res.status(404).json({ success: false, error: 'User tidak ditemukan!' });

        await user.send(message);
        res.json({ success: true, message: 'Pesan berhasil dikirim ke DM!' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Gagal mengirim DM. Pastikan user satu server dengan bot.' });
    }
});

client.login(TOKEN);

// Port otomatis untuk Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web Dashboard aktif di port ${PORT}`);
});
