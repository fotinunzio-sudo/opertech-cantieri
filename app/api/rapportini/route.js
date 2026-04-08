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

// 👇 SCARICO MAGAZZINO
for (const r of body.resources) {
  const resource = await prisma.resource.findUnique({
    where: { id: r.id }
  });

  if (resource?.type === "materiale") {
    await prisma.resource.update({
      where: { id: r.id },
      data: {
        stock: (resource.stock || 0) - r.quantity
      }
    });
  }
}
