"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isOtpSent) {
      // Trigger email provider sign-in
      const response = await signIn("email", { email, redirect: false });
      if (response?.ok) {
        setIsOtpSent(true);
      }
    } else {
      // Verify OTP
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        alert("Invalid OTP");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-2xl mb-4">
          {isOtpSent ? "Verify OTP" : "Register"}
        </h2>
        <div className="mb-4">
          <label className="block text-sm mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {isOtpSent && (
          <div className="mb-4">
            <label className="block text-sm mb-2" htmlFor="otp">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          {isOtpSent ? "Verify OTP" : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
