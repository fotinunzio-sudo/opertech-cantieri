import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const commesse = await prisma.commessa.findMany({
      orderBy: { createdAt: "desc" }
    });
    return Response.json(commesse);
  } catch (error) {
    console.error("GET /api/commesse", error);
    return Response.json({ error: "Errore caricamento commesse" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.name) {
      return Response.json({ error: "Nome commessa obbligatorio" }, { status: 400 });
    }

    const commessa = await prisma.commessa.create({
      data: {
        name: body.name,
        description: body.description || null
      }
    });

    return Response.json(commessa);
  } catch (error) {
    console.error("POST /api/commesse", error);
    return Response.json({ error: "Errore salvataggio commessa" }, { status: 500 });
  }
}
