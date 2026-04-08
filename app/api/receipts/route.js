import { prisma } from "../../../lib/prisma";
import cloudinary from "../../../lib/cloudinary";

export async function POST(req) {
  const formData = await req.formData();

  const file = formData.get("file");
  const amount = parseFloat(formData.get("amount"));
  const description = formData.get("description");
  const commessaId = formData.get("commessaId");

  if (!file) {
    return Response.json({ error: "File mancante" }, { status: 400 });
  }

  // convert file in buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // upload Cloudinary
  const upload = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "scontrini" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    ).end(buffer);
  });

  const fileUrl = upload.secure_url;

  // salva DB
  const receipt = await prisma.receipt.create({
    data: {
      fileUrl,
      amount,
      description,
      commessaId: commessaId || null
    }
  });

  // crea prima nota automatica
  await prisma.ledger.create({
    data: {
      date: new Date(),
      type: "USCITA",
      description: description || "Spesa da scontrino",
      amount,
      commessaId: commessaId || null
    }
  });

  return Response.json(receipt);
}
