import Link from "next/link";

export default function Login() {
  return (
    /* Full screen background */
    <div className="flex min-h-screen items-center justify-center bg-teal-200 font-sans">

      {/* Middle column */}
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-teal-100 sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">

          {/* Main and sub headers */}
          <h1 className="max-w-xs text-4xl font-semibold leading-10 tracking-tight text-white">
            Pediatric Adaptive Equipment Closet
          </h1>
          <h2 className="text-3xl font-semibold text-black"> Where Helping Families Comes First </h2>

          {/* Login Redirect: EDIT LATER WITH AUTHENTICATION */}
          <Link 
            className="flex h-12 w-full items-center justify-center rounded-full bg-pink-500 px-5 transition-colors hover:border-transparent hover:bg-pink-700  md:w-[158px] text-black"
            href="/inventory-gallery"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
