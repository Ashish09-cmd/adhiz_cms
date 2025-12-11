"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Image from "next/image";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      /** If OTP is enabled → backend returns temp_token */
      if(data.temp_token){
        localStorage.setItem("temp_token", data.temp_token);
        localStorage.setItem("loginEmail", email);

        window.location.href = "/vefify-otp";
        setLoading(false);
        return;
      }

      /** Direct Login (OTP disabled) → save tokens */
      if(data.accessToken && data.refreshToken){
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        window.location.href = "/dashboard";
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
      setLoading(false);
    }
    
  };
 
  if (loading) {
    return (
      <div className="flex justify-center items-center  h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="flex items-center justify-center container py-16">
        <div className="w-full lg:w-1/2 flex items-center justify-center ">
          <Card className="w-full max-w-md border border-primary-border">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center mb-4 ">
                <Image
                  src="/logo.svg"
                  alt="AdhiZ Logo"
                  width={120}
                  height={40}
                  className="filter drop-shadow-sm"
                />
              </div>
              <p className="text-gray-text-body text-md font-medium mb-4">
                Please sign in to access the dashboard
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-text-title mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-border-primary rounded-md focus:outline-none focus:ring-1 focus:ring-border-focus focus:border-transparent bg-bg-card text-text-primary placeholder-text-tertiary transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-text-title mb-2"
                  >
                  Password
                  </label>
                  <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 border border-border-primary rounded-md focus:outline-none focus:ring-1 focus:ring-border-focus focus:border-transparent bg-bg-card text-text-primary placeholder-text-tertiary transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(
                      "password"
                    ) as HTMLInputElement | null;
                    if (el) el.type = el.type === "password" ? "text" : "password";
                    }}
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {/* Eye icon */}
                    <svg

                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pointer-events-none cursor-pointer"
                    >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  </div>
                </div>
                <div className="flex items-center justify-center ">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full bg-primary-color text-white cursor-pointer py-2 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

