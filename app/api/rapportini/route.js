import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        commessa: true,
        resources: {
          include: {
            resource: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return Response.json(reports);
  } catch (error) {
    console.error("GET /api/rapportini", error);
    return Response.json({ error: "Errore caricamento rapportini" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.date) {
      return Response.json({ error: "La data è obbligatoria" }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        date: body.date,
        description: body.description || null,
        commessa: body.commessaId
          ? { connect: { id: body.commessaId } }
          : undefined,
        resources: {
          create: (body.resources || []).map((r) => ({
            quantity: Number(r.quantity || 0),
            unitCost: Number(r.unitCost || 0),
            totalCost: Number(r.quantity || 0) * Number(r.unitCost || 0),
            resource: {
              connect: { id: r.id }
            }
          }))
        }
      },
      include: {
        commessa: true,
        resources: {
          include: {
            resource: true
          }
        }
      }
    });

    for (const r of body.resources || []) {
      const resource = await prisma.resource.findUnique({
        where: { id: r.id }
      });

      if (resource?.type === "materiale") {
        await prisma.resource.update({
          where: { id: r.id },
          data: {
            stock: (resource.stock || 0) - Number(r.quantity || 0)
          }
        });
      }
    }

    return Response.json(report);
  } catch (error) {
    console.error("POST /api/rapportini", error);
    return Response.json({ error: "Errore salvataggio rapportino" }, { status: 500 });
  }
}
