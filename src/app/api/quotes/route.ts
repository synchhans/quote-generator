import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import QuoteModel from "../../../../models/Quote";
import { authenticate } from "../../../../lib/authenticate";

export async function GET() {
  try {
    await connectToDB();
    const quotes = await QuoteModel.find();

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return new NextResponse("Failed to fetch quotes", { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!authenticate(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const quotes = await req.json();

    if (!Array.isArray(quotes) || quotes.some((q) => !q.text || !q.author)) {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    await connectToDB();

    const newQuotes = await QuoteModel.insertMany(quotes);

    return NextResponse.json(newQuotes, { status: 201 });
  } catch (error) {
    console.error("Error adding quotes:", error);
    return new NextResponse("Failed to add quotes", { status: 500 });
  }
}
