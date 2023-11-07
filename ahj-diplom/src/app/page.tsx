export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <form className="flex flex-col gap-4" action="">
        <input className="rounded border px-0.5" type="email" />
        <input className="rounded border px-0.5" type="password" />
        <button
          className="rounded border text-gray-100 bg-gray-800 px-0.5 hover:bg-gray-900"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
