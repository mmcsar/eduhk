import { z } from "zod";

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(code: string, status: number, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function jsonError(e: unknown) {
  if (e instanceof ApiError) {
    return Response.json(
      { error: { code: e.code, message: e.message, details: e.details } },
      { status: e.status },
    );
  }
  if (e instanceof z.ZodError) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: e.flatten(),
        },
      },
      { status: 400 },
    );
  }
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "Internal error" } },
    { status: 500 },
  );
}

