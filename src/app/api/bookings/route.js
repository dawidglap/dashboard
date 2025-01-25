import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = "https://api.cal.com/v2/bookings";

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.CAL_API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data); // Return the bookings to the client
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching bookings" },
      { status: 500 }
    );
  }
}
