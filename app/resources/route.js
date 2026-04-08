import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" }
    });
    return Response.json(resources);
  } catch (error) {
    console.error("GET /api/resources", error);
    return Response.json({ error: "Errore caricamento risorse" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.name || !body.type) {
      return Response.json({ error: "Nome e tipo obbligatori" }, { status: 400 });
    }

    const resource = await prisma.resource.create({
      data: {
        name: body.name,
        type: body.type,
        cost: typeof body.cost === "number" ? body.cost : null,
        stock: typeof body.stock === "number" ? body.stock : null
      }
    });

    return Response.json(resource);
  } catch (error) {
    console.error("POST /api/resources", error);
    return Response.json({ error: "Errore salvataggio risorsa" }, { status: 500 });
  }
}
