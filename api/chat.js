export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST tilladt' });
  }

  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Ingen besked modtaget' });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(500).json({ error: data.error.message || 'Fejl i OpenAI-svaret' });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Noget gik galt på serveren." });
  }
}
