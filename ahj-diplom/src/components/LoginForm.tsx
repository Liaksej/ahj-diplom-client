import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AtSymbolIcon } from "@heroicons/react/24/outline";

export default function LoginForm() {
  async function loginToServer(formData: FormData) {
    "use server";
    if (!formData.get("email")) {
      return;
    }
    cookies().set("email", formData.get("email") as string);
    redirect("/dashboard");
  }

  return (
    <form action={loginToServer} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-1">
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-light text-gray-900"
              htmlFor="email"
            >
              Enter your email to continue...
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <LoginButton />
      </div>
    </form>
  );
}

function LoginButton() {
  return (
    <button className="mt-4 w-full rounded bg-gray-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-blue-800  py-2 text-white">
      Log in
    </button>
  );
}
