import { prisma } from "../../../lib/prisma";

export async function POST(req) {
  const formData = await req.formData();

  const file = formData.get("file");
  const amount = parseFloat(formData.get("amount"));
  const description = formData.get("description");
  const commessaId = formData.get("commessaId");

  // ⚠️ per ora salviamo solo nome file (demo)
  const fileUrl = file?.name || "scontrino.jpg";

  // 1️⃣ salva scontrino
  const receipt = await prisma.receipt.create({
    data: {
      fileUrl,
      amount,
      description,
      commessaId: commessaId || null
    }
  });

  // 2️⃣ crea movimento prima nota AUTOMATICO
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
