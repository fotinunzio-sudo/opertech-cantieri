import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "File mancante" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Sei un sistema che estrae dati da scontrini. Rispondi SOLO in JSON."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Estrai: totale, data, fornitore. Rispondi JSON."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64}`
              }
            }
          ]
        }
      ]
    });

    const text = response.choices[0].message.content;

    let parsed = {};

    try {
      parsed = JSON.parse(text);
    } catch {
      return Response.json({ raw: text });
    }

    return Response.json(parsed);

  } catch (error) {
    console.error("OCR AI ERROR:", error);
    return Response.json({ error: "Errore OCR AI" }, { status: 500 });
  }
}
