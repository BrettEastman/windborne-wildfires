import { json } from "@sveltejs/kit";

const API_KEY = "dc2b08b88b2888a01a06233aaec18774";
const FIRMS_URL = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${API_KEY}/MODIS_NRT/world/1`;

export async function GET() {
  try {
    const response = await fetch(FIRMS_URL);

    if (!response.ok) {
      return json(
        { error: "Failed to fetch wildfire data" },
        { status: response.status }
      );
    }

    const csvText = await response.text();
    return new Response(csvText, {
      headers: {
        "Content-Type": "text/csv",
      },
    });
  } catch (error) {
    console.error("Error fetching wildfire data:", error);
    return json({ error: "Failed to fetch wildfire data" }, { status: 500 });
  }
}
