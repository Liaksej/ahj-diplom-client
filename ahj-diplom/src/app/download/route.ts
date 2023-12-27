import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  if (!searchParams) {
    throw new Error(`Query are required`);
  }

  const query = {
    resource: searchParams.get("resource") as string,
    fileName: searchParams.get("fileName") as string,
    mime: searchParams.get("mime") as string,
  };

  const response = await fetch(query.resource, {});

  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status}`);
  }

  const blob = await response.blob();

  return new Response(blob, {
    headers: {
      "Content-Type": query.mime,
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
        query.fileName,
      )}`,
    },
  });
}
