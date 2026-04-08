import Tesseract from "tesseract.js";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return Response.json({ error: "File mancante" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await Tesseract.recognize(buffer, "ita+eng");

  const text = result.data.text;

  // 🔍 parsing base
  const amountMatch = text.match(/(\d+[.,]\d{2})/);
  const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);

  const amount = amountMatch
    ? parseFloat(amountMatch[1].replace(",", "."))
    : null;

  const date = dateMatch ? dateMatch[0] : null;

  return Response.json({
    rawText: text,
    amount,
    date
  });
}
