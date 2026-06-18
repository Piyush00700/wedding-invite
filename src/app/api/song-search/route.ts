import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/song-search?q=<query>
 * Proxies YouTube Music search_suggestions from RapidAPI.
 * API key stays server-side — never exposed to the browser.
 *
 * Response shape from RapidAPI:
 * {
 *   query: string[],          // text-only suggestions
 *   items: [{
 *     thumbnail: string,
 *     title: string,
 *     subtitle: string,       // "Song • Artist • Xm plays"
 *     browseId: string,
 *     isExplicit: boolean,
 *     type: "songs" | "videos"
 *   }]
 * }
 */

export interface SongItem {
  title: string;
  subtitle: string;
  thumbnail: string;
  browseId: string;
  type: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  try {
    const response = await fetch(
      `https://youtube-music-api3.p.rapidapi.com/search_suggestions?q=${encodeURIComponent(q)}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY || "d09ebb5172msh21cdf170c968699p111f63jsn679b2b551a10",
          "x-rapidapi-host": "youtube-music-api3.p.rapidapi.com",
        },
        // Cache for 60s — same query won't re-hit RapidAPI within a minute
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ items: [] }, { status: response.status });
    }

    const data = await response.json();

    // Prefer rich items[] array; fall back to text-only query[] suggestions
    let items: SongItem[] = [];

    if (Array.isArray(data?.items) && data.items.length > 0) {
      items = (data.items as SongItem[]).slice(0, 5);
    } else if (Array.isArray(data?.query)) {
      // Convert plain text suggestions into SongItem shape
      items = (data.query as string[]).slice(0, 5).map((title: string) => ({
        title,
        subtitle: "",
        thumbnail: "",
        browseId: "",
        type: "songs",
      }));
    }

    return NextResponse.json({ items });
  } catch (err) {
    console.error("[song-search] fetch failed:", err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
