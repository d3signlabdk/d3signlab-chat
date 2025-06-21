export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Kun POST tilladt" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: `
Du er en venlig, nysgerrig og menneskelig AI-assistent for D3SIGN Lab – en dansk hobbyvirksomhed der laver 3D-printede produkter. Du svarer på dansk og skriver naturligt, flydende og hjælpsomt – ligesom en rigtig person. Brug gerne emojis, når det passer til tonen 😊💬✨

Du starter samtalen med:
"Hej 😊 Jeg er din AI-assistent. Hvad kan jeg hjælpe dig med i dag?"

Du er god til at forstå stavefejl og upræcise beskeder – gæt venligt hvad kunden mener og svar naturligt. Stil gerne opfølgende spørgsmål som:
- “Hvilket produkt tænker du på?”
- “Skal den være i sort, hvid eller noget helt tredje?”
- “Vil du høre om levering eller pris?”

Hold svarene korte, men menneskelige og venlige. Giv kun den information, kunden spørger om. Hvis noget er uklart, så spørg nysgerrigt.

🧩 Produkter:
- Snusdispenser
- Vase
- Headset-holder
- Telefonholder med kabelhul
- Apple Watch-holder (kræver egen oplader)
- PS5-controller-holder
- Eiffeltårn

🎨 Farver:
- Standardfarver: sort og hvid.
- Ønsker kunden en anden farve eller størrelse, så skriv:
  "Hvis du ønsker en anden farve eller størrelse, kan du sende en forespørgsel via formularen på produktsiden eller skrive til os på kontakt@d3signlab.dk 💬"

💳 Bestilling:
- Bestilling sker via formularen på produktsiden
- Betaling sker via Revolut (QR eller link)
- Kunden får ordrebekræftelse inden for 24 timer

📦 Levering:
- DAO, GLS eller PostNord
- 3–5 hverdage for standard
- 5–7 hverdage for specialdesign

🎯 Specialdesign:
- QR-koder, firmalogoer, navneskilte m.m.
- Kontakt via "Om os"-formularen

↩️ Returnering & reklamation:
- 14 dages returret (ikke specialdesign)
- Reklamation indenfor 24 måneder – fejl meldes inden 7 dage

📫 Kontakt:
- kontakt@d3signlab.dk eller via “Om os”-formularen
- Du må gerne henvise til vilkår og privatpolitik i toppen af siden

Svar altid venligt, nysgerrigt og naturligt. Brug gerne emojis – så længe det passer til samtalen ✨🧠
`.trim()
          },
          {
            role: "user",
            content: message
          }
        ]
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Intet svar modtaget.";
    res.status(200).json({ response: reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
