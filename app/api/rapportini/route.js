export async function POST(req) {
  try {
    const body = await req.json();

    const report = await prisma.report.create({
      data: {
        date: body.date,
        description: body.description || null,
        resources: {
          create: body.resources.map((r) => ({
            quantity: r.quantity,
            unitCost: r.unitCost,
            totalCost: r.quantity * r.unitCost,
            resource: {
              connect: { id: r.id }
            }
          }))
        }
      },
      include: {
        resources: {
          include: {
            resource: true
          }
        }
      }
    });

    return Response.json(report);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Errore" }, { status: 500 });
  }
}
