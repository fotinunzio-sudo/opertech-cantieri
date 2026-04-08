import { prisma } from "../../../lib/prisma";

export async function GET() {
  const data = await prisma.ledger.findMany({
    include: { commessa: true },
    orderBy: { date: "desc" }
  });

  return Response.json(data);
}

export async function POST(req) {
  const body = await req.json();

  const entry = await prisma.ledger.create({
    data: {
      date: new Date(body.date),
      type: body.type,
      description: body.description,
      amount: Number(body.amount),
      commessaId: body.commessaId || null
    }
  });

  return Response.json(entry);
}
