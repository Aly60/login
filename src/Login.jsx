import React, { useState } from "react";
import axios from "axios";
import { sentEmail } from "./helper/emailjs";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Generate and send OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await sentEmail({
        to: email,
        to_name: username,
        from_name: "Login Page",
        message: `Your OTP is ${otpCode}`,
      });

      const res = await axios.post("http://localhost:5000/otps", {
        email,
        otp: otpCode,
      });
      if (res.status === 200) {
        localStorage.setItem("otpEmail", email);
        setStep("verify");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    const storedEmail = localStorage.getItem("otpEmail");

    try {
      // Verify OTP by fetching it from the server
      const { data } = await axios.get("http://localhost:5000/otps", {
        params: { email: storedEmail },
      });
      const isValidOtp = data.some((entry) => entry.otp === otp);

      if (isValidOtp) {
        console.log("OTP verified");
        localStorage.removeItem("otpEmail");
        setStep("login");
      } else {
        console.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div
          className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
          style={{
            backgroundImage: `url(https://www.tailwindtap.com/assets/components/form/userlogin/login_tailwindtap.jpg)`,
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">
            {step === "login" ? "Welcome back!" : "Verify your OTP"}
          </p>
          {step === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-8">
                <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                  Send OTP
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpVerification}>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  OTP
                </label>
                <input
                  className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <div className="mt-8">
                <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                  Verify OTP
                </button>
              </div>
            </form>
          )}
          <div className="mt-4 flex items-center w-full text-center">
            <a
              href="/"
              className="text-xs text-gray-500 capitalize text-center w-full"
            >
              Don&apos;t have an account yet?
              <span className="text-blue-700"> Sign Up</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
