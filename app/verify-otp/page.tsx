"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Image from "next/image";
import { verifyOTP, resendOTP, logout } from "@/lib/api/auth";

const OTPPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
      document.getElementById(`otp-${index + 1}`)?.focus();
    } else if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return alert("Enter 6-digit OTP");

    try {
      const data = await verifyOTP(otpCode);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.removeItem("temp_token");
      localStorage.removeItem("loginEmail");
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.message || err.message || "OTP verification failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // mask email
  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");

    if (name.length <= 5) {
      return email; // too short to mask safely
    }

    const firstTwo = name.slice(0, 2);
    const lastTwo = name.slice(-2);

    return `${firstTwo}*****${lastTwo}@${domain}`;
  
  };
 

  const handleResend = async () => {
    try {
      await resendOTP();
      alert("A new OTP has been sent to your email");
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.message || err.message || "Failed to resend OTP"
      );
    }
  };



  return (
    // <div className="min-h-screen bg-bg-primary flex justify-center items-center">
    //   <Card className="w-full max-w-md">
    //     <CardHeader className="text-center">
    //       <Image src="/logo.svg" alt="Logo" width={120} height={40} />
    //       <p>Enter the 6-digit OTP sent to {email}</p>
    //     </CardHeader>
    //     <CardContent>
    //       <form onSubmit={handleSubmit} className="space-y-4">
    //         <div className="flex justify-center space-x-2">
    //           {otp.map((digit, index) => (
    //             <input
    //               key={index}
    //               id={`otp-${index}`}
    //               type="text"
    //               maxLength={1}
    //               value={digit}
    //               onChange={(e) => handleOtpChange(index, e.target.value)}
    //               className="w-12 h-12 text-center border rounded"
    //             />
    //           ))}
    //         </div>
    //         <Button type="submit" className="w-full">Verify OTP</Button>
    //         <Button type="button" className="w-full" onClick={handleResend}>
    //           Resend OTP
    //         </Button>
    //         <Button type="button" className="w-full" onClick={logout}>
    //           Logout
    //         </Button>
    //       </form>
    //     </CardContent>
    //   </Card>
    // </div>
    <div className="min-h-screen bg-bg-primary">
      <div className="flex items-center justify-center container py-16">
        <Card className="w-full max-w-md border border-primary-border">
          <CardHeader className="text-center  pb-2">
            <div className="flex items-center justify-center ">
            <Image src="/logo.svg" alt="Logo" width={120} height={40} />
            </div>
            <p className="text-gray-text-body mt-4">
              Enter the 6-digit OTP sent to {maskEmail(email)}
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

              <Button
                type="submit"
                className="w-full bg-primary-subtitle rounded-sm  text-white"
              >
                Verify OTP
              </Button>

              <Button
                type="button"
                className="w-full bg-secondary-color rounded-sm  text-white"
                onClick={handleResend}
              >
                Resend OTP
              </Button>

              <Button
                type="button"
                className="w-full border border-primary-color rounded-sm text-primary-color"
                onClick={logout}
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
