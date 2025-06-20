export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST tilladt' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Ingen besked modtaget' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Du er en venlig og hjælpsom AI-assistent for D3SIGN Lab. Hjælp med spørgsmål om produkter, 3D-print og ordrer.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || 'Intet svar modtaget.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Serverfejl ved kontakt til OpenAI' });
  }
}
