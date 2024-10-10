import { getServerSession } from "@/lib/next-auth";
import { InvoiceRequestBody } from "@/types/xendit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Xendit } from "xendit-node";

const xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });

const { Invoice } = xenditClient;

export async function POST(req: NextRequest) {
  const { amount, description } = (await req.json()) as InvoiceRequestBody;
  const session = await getServerSession();
  if (!session)
    return NextResponse.json(
      { status: 403, message: "Forbidden" },
      { status: 403 },
    );

  try {
    const createdInvoice = await Invoice.createInvoice({
      data: {
        externalId: uuidv4(),
        amount,
        payerEmail: session.user?.email,
        description,
        successRedirectUrl: `${process.env.APP_URL}/bookings`,
        failureRedirectUrl: `${process.env.APP_URL}/`,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        message: "Successfully created an invoice",
        invoice: createdInvoice,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
