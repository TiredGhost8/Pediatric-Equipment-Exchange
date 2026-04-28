"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword]=useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error(error);
      return;
    }

    router.push("/equipment-gallery"); //go to gallery on successful login
    router.refresh();
  }

  return (
    /* Full screen background */
    <div className="flex min-h-screen w-full items-center justify-center bg-[#91B472]">

      {/* Middle box */}
      <main className="flex w-full max-w-md flex-col items-center justify-center p-6 bg-[#FBF5DB] rounded-2xl shadow-md">
        <h1 className= "text-3xl font-semibold mb-6 text-center w-full"> Login </h1>

        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          
          <div>
            <ul className="flex w-flex flex-col gap-5 text-lg"> 
              
              <li className="border border-black rounded-lg p-2"> <input onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" /> </li>
              <li className="border border-black rounded-lg p-2"> <input type ="password" value= {email} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"/>  </li>
            </ul>
          </div>

          <button
            className="inline-flex items-center justify-center h-8 px-6 rounded-full bg-[#5a9e3a] text-white text-lg transition-colors hover:bg-[#4a8a2e] w-full md:w-auto"
            onClick={handleLogin}
          >
           Login
          </button>

          <Link 
            className="inline-flex items-center justify-center h-8 px-6 rounded-full bg-[#5a9e3a] text-white text-lg transition-colors hover:bg-[#4a8a2e] w-full md:w-auto hover:cursor-pointer"
            href="/equipment-gallery"
          >
           View as Guest
          </Link>
        </div>
      </main>
    </div>
  );
}