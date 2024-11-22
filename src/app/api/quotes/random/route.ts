import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDB();
    const randomQuote = await db!
      .collection("quotes")
      .aggregate([
        { $sample: { size: 1 } },
        { $project: { text: 1, author: 1 } },
      ])
      .toArray();

    if (randomQuote.length === 0) {
      return NextResponse.json({ message: "No quotes found" }, { status: 404 });
    }

    return NextResponse.json(randomQuote[0]);
  } catch (error) {
    console.error("Error fetching random quote:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
