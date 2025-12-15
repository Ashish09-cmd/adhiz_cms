"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Image from "next/image";
import { login } from "@/lib/api/auth";
import { Icon } from "@iconify/react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login({ email, password });

      if (data.temp_token) {
        localStorage.setItem("temp_token", data.temp_token);
        localStorage.setItem("loginEmail", email);
        window.location.href = "/verify-otp";
      } else if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        window.location.href = "/dashboard";
      } else {
        alert("Login failed");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Login failed");
    } finally {
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
                    className="w-full px-4 py-3 rounded-sm border border-border-primary  focus:outline-none focus:ring-1 focus:ring-border-focus focus:border-transparent bg-bg-card text-text-primary placeholder-text-tertiary transition-all duration-200"
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
                    {/* <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-sm border border-border-primary focus:outline-none focus:ring-1 focus:ring-border-focus focus:border-transparent bg-bg-card text-text-primary placeholder-text-tertiary transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    /> */}
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-sm border border-border-primary focus:outline-none focus:ring-1 focus:ring-border-focus focus:border-transparent bg-bg-card text-text-primary placeholder-text-tertiary transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text-title"
                    >
                      {showPassword ? (
                        <Icon icon="ion:eye" className="text-lg" />
                      ) : (
                        <Icon icon="ion:eye-off" className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center ">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full bg-primary-subtitle rounded-sm text-white cursor-pointer py-2 cursor-pointer"
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
