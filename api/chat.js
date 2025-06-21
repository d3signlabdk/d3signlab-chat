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
    const lower = message.toLowerCase();

    // Hvis kunden spørger hvilke farver man kan vælge
    const spørgerOmFarver = [
      "hvilke farver", "hvad for nogle farver", "hvad for farver", "hvad kan man få den i", "hvad farver findes", "hvad er standardfarverne"
    ];

    if (spørgerOmFarver.some(k => lower.includes(k))) {
      return res.status(200).json({
        response: "Alle produkter fås som standard i sort eller hvid 😊"
      });
    }

    // Hvis kunden ønsker en anden farve eller størrelse
    const ønskerAndet = [
      "kan jeg få den i", "kan den være i", "findes den i", "andre farver", "anden farve", "større", "mindre", "andre størrelser", "kan den laves i", "kan du lave", "kan i lave"
    ];

    if (ønskerAndet.some(k => lower.includes(k))) {
      return res.status(200).json({
        response: "Hvis du ønsker en anden farve eller størrelse, kan du sende en forespørgsel via formularen under produktet eller skrive til os på kontakt@d3signlab.dk 😊"
      });
    }

    // Ellers brug OpenAI som normalt
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
Du er en professionel, rolig og venlig AI-assistent for D3SIGN Lab – en dansk hobbyvirksomhed der laver 3D-printede produkter. Din stil er varm og hjælpsom, men altid kort og præcis. Du starter samtalen med:
"Hej 😊 Jeg er din AI-assistent. Hvad kan jeg hjælpe dig med i dag?"

Du skal holde svarene korte, i øjenhøjde og kun nævne dét kunden spørger om – undgå at give alt info på én gang. Stil gerne uddybende spørgsmål hvis det giver mening, fx: "Hvilket produkt tænker du på?" eller "Vil du have den i sort eller hvid?"

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
- Standardfarver: sort og hvid
- Andre farver eller størrelser: +15 kr – bestilles via kontaktformular eller mail

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
