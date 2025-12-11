"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Image from "next/image";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("loginEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);









  
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    } else if (!value && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return alert("Enter 6-digit OTP");

    const temp_token = localStorage.getItem("temp_token");
    if (!temp_token) return alert("Session expired. Login again.");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return alert("API URL not configured. Please contact support.");

    try {
      const res = await fetch(
        `${apiUrl}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${temp_token}`,
          },
          body: JSON.stringify({ otp: otpCode }),
        }
      );

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: "Invalid response from server" };
      }

      if (!res.ok) {
        alert(data.error || "Invalid OTP");
        return;
      }

      // Save real JWT tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Remove temp token
      localStorage.removeItem("temp_token");
      localStorage.removeItem("loginEmail");

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Network error: OTP verification failed. Please check your connection.");
    }
  };

  // resend otp

 const handleResendOTP = async () => {
  const temp_token = localStorage.getItem("temp_token");
  if (!temp_token) return alert("Session expired. Login again.");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return alert("API URL not configured. Please contact support.");

  try {
    const res = await fetch(
      `${apiUrl}/auth/resend-otp`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${temp_token}`,
        }
      }
    );

    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      data = { error: "Invalid response from server" };
    }

    if (!res.ok) {
      alert(data.error || "Failed to resend OTP");
      return;
    }

    alert("A new OTP has been sent to your email");
  } catch (err) {
    console.error("Resend OTP error:", err);
    alert("Network error: Unable to resend OTP. Please check your connection.");
  }
};


  const handleLogout = () => {
    localStorage.removeItem("temp_token");
    localStorage.removeItem("loginEmail");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="flex items-center justify-center container py-16">
        <Card className="w-full max-w-md border border-primary-border">
          <CardHeader className="text-center pb-2">
            <Image src="/logo.svg" alt="Logo" width={120} height={40} />
            <p className="text-gray-text-body mt-4">
              Enter the 6-digit OTP sent to {email}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center border rounded"
                  />
                ))}
              </div>
              <Button type="submit" className="w-full bg-primary-color cursor-pointer text-white">
                Verify OTP
              </Button>
              <Button
                type="button"
                className="w-full bg-secondary-color text-white cursor-pointer"
                onClick={handleResendOTP}
              >
                Resend OTP
              </Button>
              <Button
                type="button"
                className="w-full border border-primary-color text-primary-color cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPPage;
