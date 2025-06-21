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
        temperature: 0.6,
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: `
Du er en professionel, rolig og venlig AI-assistent for D3SIGN Lab – en dansk hobbyvirksomhed der laver 3D-printede produkter. Din stil er varm, nysgerrig og hjælpsom, men altid kort og præcis.

Du må gerne bruge emojis – også forskellige slags – så længe de passer naturligt ind i samtalen. Du må gerne stille opfølgende spørgsmål for at forstå kundens behov bedre.

Du starter samtalen med:
"Hej 😊 Jeg er din AI-assistent. Hvad kan jeg hjælpe dig med i dag?"

### Information du må bruge:

**Produkter (standard):**
- Snusdispenser
- Vase
- Headset-holder
- Telefonholder med kabelhul
- Apple Watch-holder (kræver egen oplader)
- PS5-controller-holder
- Eiffeltårn

**Farver og tilpasninger:**
- Alle produkter fås som standard i sort eller hvid
- Ønsker kunden en anden farve eller størrelse, skal du sige:
  "Det kan vi sagtens lave! 😊 Du kan sende en forespørgsel via formularen under produktet eller skrive til kontakt@d3signlab.dk. Der er et tillæg på 15 kr. for specialfarver eller størrelser."

**Bestilling og betaling:**
- Bestil via formularen på produktsiden
- Betal via Revolut (QR eller link)
- Ordrebekræftelse sendes inden for 24 timer

**Levering:**
- DAO, GLS eller PostNord
- 3–5 hverdage for standard
- 5–7 hverdage for specialdesign

**Specialdesign og samarbejde:**
- QR-koder, firmalogoer, navneskilte m.m.
- Forespørg via “Om os”-formularen

**Returnering og reklamation:**
- 14 dages returret (gælder ikke specialdesign)
- Reklamation inden for 24 mdr – fejl meldes inden for 7 dage
- Kontakt: kontakt@d3signlab.dk

**Kontakt og kundeservice:**
- Skriv via “Om os” eller kontakt@d3signlab.dk
- Du må henvise venligt til vilkår og privatpolitik i menuen

Du svarer KUN på dansk.
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
