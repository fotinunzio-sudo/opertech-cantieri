import Tesseract from "tesseract.js";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { error: "File mancante" },
        { status: 400 }
      );
    }

    // 🔁 conversione file → buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🤖 OCR
    const result = await Tesseract.recognize(buffer, "ita+eng", {
      logger: (m) => console.log(m) // debug (puoi togliere)
    });

    const text = result.data.text;

    // 🔍 ESTRAZIONE IMPORTO (più robusta)
    const amountMatches = text.match(/(\d+[.,]\d{2})/g);

    let amount = null;

    if (amountMatches && amountMatches.length > 0) {
      // prende l'importo più alto (di solito il totale)
      const values = amountMatches.map(v =>
        parseFloat(v.replace(",", "."))
      );

      amount = Math.max(...values);
    }

    // 🔍 ESTRAZIONE DATA
    const dateMatch =
      text.match(/\d{2}\/\d{2}\/\d{4}/) ||
      text.match(/\d{2}-\d{2}-\d{4}/);

    const date = dateMatch ? dateMatch[0] : null;

    return Response.json({
      rawText: text,
      amount,
      date
    });
  } catch (error) {
    console.error("OCR ERROR:", error);

    return Response.json(
      { error: "Errore OCR" },
      { status: 500 }
    );
  }
}
