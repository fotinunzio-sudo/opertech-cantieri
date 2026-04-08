import { prisma } from "../../../lib/prisma";

export async function GET() {
  const data = await prisma.commessa.findMany({
    orderBy: { createdAt: "desc" }
  });
  return Response.json(data);
}

export async function POST(req) {
  const body = await req.json();

  const commessa = await prisma.commessa.create({
    data: {
      name: body.name,
      description: body.description
    }
  });

  return Response.json(commessa);
}
