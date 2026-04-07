import { prisma } from "../../../lib/prisma";

export async function GET() {
  const resources = await prisma.resource.findMany();
  return Response.json(resources);
}

export async function POST(req) {
  const body = await req.json();

  const resource = await prisma.resource.create({
    data: {
      name: body.name,
      type: body.type,
      cost: body.cost ?? null,
    },
  });

  return Response.json(resource);
}
