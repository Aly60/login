import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login"); // Can be 'login' or 'verify'

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Generate and send OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await axios.post("http://localhost:5000/otps", { email, otp: otpCode });
      localStorage.setItem("otpEmail", email);
      localStorage.setItem(`otp_${email}`, otpCode); // Store OTP in localStorage (for demonstration)
      setStep("verify"); // Move to OTP verification step
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    const storedEmail = localStorage.getItem("otpEmail");
    //  const storedOtp = localStorage.getItem(`otp_${storedEmail}`);

    try {
      // Verify OTP
      const { data } = await axios.get("http://localhost:5000/otps", {
        params: { email: storedEmail },
      });
      const isValidOtp = data.some((entry) => entry.otp === otp);

      if (isValidOtp) {
        localStorage.removeItem("otpEmail");
        localStorage.removeItem(`otp_${storedEmail}`);
        console.log("OTP verified");
        // Handle successful login
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
              href="#"
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
