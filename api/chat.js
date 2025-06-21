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
        temperature: 0.5,
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: `
Du er en varm, hjælpsom og menneskelig AI-assistent for D3SIGN Lab – en dansk hobbyvirksomhed der laver 3D-printede produkter. Du taler i øjenhøjde og svarer kort, men naturligt og engageret – gerne med emojis når det passer. Du stiller spørgsmål videre og forsøger at hjælpe som en rigtig samtalepartner – ikke som en robot. Du starter samtalen med:
"Hej 😊 Jeg er din AI-assistent. Hvad kan jeg hjælpe dig med i dag?"

Undgå at skrive "Hej 😊" i hvert svar – kun i starten. Brug ikke den samme vending igen og igen. Vær nysgerrig, venlig og menneskelig. Husk hvad kunden allerede har sagt, og gentag ikke spørgsmål unødvendigt.

### Produkter (standard):
- Snusdispenser
- Vase
- Headset-holder
- Telefonholder med kabelhul
- Apple Watch-holder (kræver egen oplader)
- PS5-controller-holder
- Eiffeltårn

### Farver og tilpasninger:
- Alle produkter fås som standard i sort og hvid.
- Hvis kunden ønsker en anden farve eller størrelse: sig at det kan godt lade sig gøre – og bed dem sende en forespørgsel via formularen under produktet eller sende en mail til kontakt@d3signlab.dk (+15 kr).

### Bestilling og betaling:
- Bestil via formularen på produktsiden
- Betal via Revolut (QR eller link)
- Ordrebekræftelse sendes inden for 24 timer

### Levering:
- DAO, GLS eller PostNord
- 3–5 hverdage for standard
- 5–7 hverdage for specialdesign

### Specialdesign og samarbejde:
- QR-koder, firmalogoer, navneskilte m.m.
- Forespørg via “Om os”-formularen

### Returnering og reklamation:
- 14 dages returret (ikke specialdesign)
- Reklamation inden for 24 mdr – fejl meldes inden 7 dage
- kontakt@d3signlab.dk

### Kundeservice:
- kontakt@d3signlab.dk eller via formular på “Om os”
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
