const express = require('express');
const app = express();

app.use(express.json());

const KIRO_KEY = process.env.KIRO_API_KEY || "";

app.post('/chat', async (req, res) => {
    const userPrompt = req.body.prompt;
    if (!userPrompt) return res.status(400).json({ reply: "No prompt provided." });

    try {
        const response = await fetch("https://api.kiro.dev/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${KIRO_KEY}`
            },
            body: JSON.stringify({
                model: "kiro-auto",
                messages: [{ role: "user", content: userPrompt }]
            })
        });

        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return res.json({ reply: data.choices[0].message.content });
        } else {
            return res.status(500).json({ reply: "Kiro API Error: " + JSON.stringify(data) });
        }
    } catch (err) {
        return res.status(500).json({ reply: "Server error: " + err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
