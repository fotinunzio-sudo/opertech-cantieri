import { prisma } from "../../../lib/prisma";

export async function GET() {
  const data = await prisma.invoice.findMany({
    include: { commessa: true }
  });
  return Response.json(data);
}

export async function POST(req) {
  const body = await req.json();

  const invoice = await prisma.invoice.create({
    data: {
      commessaId: body.commessaId,
      amount: Number(body.amount),
      description: body.description || null
    }
  });

  return Response.json(invoice);
}
