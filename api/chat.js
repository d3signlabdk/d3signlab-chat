export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST tilladt' });
  }

  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  // Fejl hvis API-nøgle mangler
  if (!apiKey) {
    return res.status(500).json({ error: 'API-nøgle mangler på serveren' });
  }

  // Fejl hvis besked mangler
  if (!message) {
    return res.status(400).json({ error: 'Ingen besked modtaget' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Du er en venlig og hjælpsom AI-assistent for D3SIGN Lab. Hjælp med spørgsmål om produkter, 3D-print og ordrer."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    // Hvis der ikke er noget svar
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ error: 'Intet svar modtaget fra OpenAI', raw: data });
    }

    // Send svaret fra AI’en tilbage til klienten
    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error('Serverfejl:', error);
    res.status(500).json({ error: 'Fejl ved kontakt til OpenAI' });
  }
}
