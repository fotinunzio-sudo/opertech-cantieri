import { prisma } from "../../../lib/prisma";

export async function GET() {
  const reports = await prisma.report.findMany({
    include: {
      resources: true
    }
  });

  return Response.json(reports);
}

export async function POST(req) {
  const body = await req.json();

  const report = await prisma.report.create({
    data: {
      date: body.date,
      description: body.description,
      resources: {
        connect: body.resourceIds.map((id) => ({ id }))
      }
    }
  });

  return Response.json(report);
}
