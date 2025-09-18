"use client"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/admin/loading-spinner"
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function LoginPage() {

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleForm(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (  
    <div className="min-h-screen">
        <Header />
        <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#3A2D28] via-[#A48374] to-[#EBE3DB] relative overflow-hidden">
  {/* Decorative floating shapes */}
  <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
    <div className="absolute top-20 left-10 w-32 h-32 bg-[#A48374] rounded-full animate-float" />
    <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#CBAD8D] rounded-full animate-float-delayed" />
    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#EBE3DB] rounded-full animate-float-slow" />
  </div>
  <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md relative z-10" data-aos="fade-up">
    <h2 className="text-2xl font-bold mb-6 text-center text-[#3A2D28]">Admin Login</h2>
    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
    <form className="space-y-6" onSubmit={handleForm} method="POST">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-[#A48374]">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full border border-[#CBAD8D] rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#A48374]"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#A48374]">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full border border-[#CBAD8D] rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#A48374]"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#A48374] hover:bg-[#CBAD8D] text-[#3A2D28] py-2 px-4 rounded-md transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Logging in...</span>
          </div>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  </div>
</section>

        <Footer />
          </div>
  )
}