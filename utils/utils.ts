import { redirect } from "next/navigation";

export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  const searchParams = new URLSearchParams();
  searchParams.set(type, message);
  // In Server Actions, we need to throw the redirect
  throw redirect(`${path}?${searchParams.toString()}`);
}