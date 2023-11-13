"use client";

import { useFormState } from "react-dom";
import { authenticate } from "@/library/actions";
import Cookie from "js-cookie";

export default function LoginForm() {
  const [code, action] = useFormState(authenticate, undefined);

  if (code && code !== "CredentialSignin") {
    console.log(code);
    Cookie.set("token", code, { expires: 24 * 60 * 60 });
  }

  return (
    <form className="flex flex-col gap-4" action={action}>
      <input
        className="rounded border px-0.5 dark:text-black"
        name="email"
        type="email"
      />
      <input
        className="rounded border px-0.5 dark:text-black"
        type="password"
        name="password"
      />
      <button
        className="rounded border text-gray-100 bg-gray-800 px-0.5 hover:bg-gray-900"
        type="submit"
      >
        Login
      </button>
      <div className="flex h-8 items-end space-x-1">
        {code === "CredentialSignin" ? (
          <p aria-live="polite" className="text-sm text-red-500">
            Invalid credentials
          </p>
        ) : null}
      </div>
    </form>
  );
}
