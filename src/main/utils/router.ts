import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

type Return =
  | {
      req: NextRequest;
      res: NextResponse;
      routerType: "APP";
      path: string;
    }
  | {
      req: NextApiRequest;
      res: NextApiResponse;
      routerType: "PAGES";
      path: string;
    };

export function formatRouter(
  req: NextApiRequest | NextRequest,
  res: NextApiResponse | NextResponse
): Return {
  if ((res as any)?.params) {
    return {
      req: req as NextRequest,
      res: res as NextResponse,
      routerType: "APP",
      path: new URL((req as NextRequest).nextUrl).pathname,
    };
  }
  return {
    req: req as NextApiRequest,
    res: res as NextApiResponse,
    routerType: "PAGES",
    path: req.url || "",
  };
}
