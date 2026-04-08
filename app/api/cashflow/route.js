import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const movements = await prisma.ledger.findMany({
      orderBy: { date: "asc" }
    });

    let totaleEntrate = 0;
    let totaleUscite = 0;

    const timeline = [];

    movements.forEach((m) => {
      if (m.type === "ENTRATA") {
        totaleEntrate += m.amount;
      } else {
        totaleUscite += m.amount;
      }

      timeline.push({
        date: m.date,
        saldo: totaleEntrate - totaleUscite
      });
    });

    return Response.json({
      totaleEntrate,
      totaleUscite,
      saldo: totaleEntrate - totaleUscite,
      timeline
    });

  } catch (error) {
    console.error("CASHFLOW ERROR", error);
    return Response.json({ error: "Errore cash flow" }, { status: 500 });
  }
}
