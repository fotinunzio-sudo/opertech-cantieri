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
    cost: typeof body.cost === "number" ? body.cost : null,
    stock: typeof body.stock === "number" ? body.stock : null // 👈 QUESTO
  }
});
  return Response.json(resource);
}
<input
  placeholder="Giacenza"
  type="number"
  value={form.stock}
  onChange={(e) => setForm({ ...form, stock: e.target.value })}
/>
