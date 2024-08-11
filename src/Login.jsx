import React, { useState, useEffect } from "react";
import axios from "axios";
import { sentEmail } from "./helper/emailjs";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isButtonDisabled = !email || !password || loading;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Check if the user exists
      const { data: users } = await axios.get("http://localhost:5000/users");
      const user = users.find(
        (user) => user.password === password && user.email === email
      );

      if (!user) {
        setError("Invalid password or email");
        setLoading(false);
        return;
      }

      // Generate and send OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await sentEmail({
        to: email,
        from_name: "Login Page",
        message: `Your OTP is ${otpCode}`,
      });

      // Store OTP in the JSON server
      await axios.post("http://localhost:5000/otps", {
        email,
        otp: otpCode,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("otpEmail", email);
      setStep("verify");
      setSuccess("OTP has been sent successfully!");
      setLoading(false);
    } catch (error) {
      setError("Error during login. Please try again.");
      console.error("Error during login:", error);
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError("");

    const storedEmail = localStorage.getItem("otpEmail");
    const currentTime = new Date().toISOString();

    try {
      // Verify OTP by fetching it from the server
      const { data } = await axios.get("http://localhost:5000/otps", {
        params: { email: storedEmail },
      });

      const otpEntry = data.find((entry) => entry.otp === otp);
      if (!otpEntry) {
        setError("Invalid OTP");
        localStorage.removeItem("otpEmail");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      const otpAge =
        (new Date(currentTime) - new Date(otpEntry.createdAt)) / 1000 / 60;
      if (otpAge > 5) {
        setError("OTP has expired");
        localStorage.removeItem("otpEmail");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      console.log("OTP verified");
      localStorage.removeItem("otpEmail");
      setSuccess("OTP verified successfully! Redirecting...");

      navigate("/");
    } catch (error) {
      setError("Error verifying OTP. Please try again.");
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
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
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
              <div className="mt-4 relative">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-semibold">
                  Show Password
                </label>
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  className={`bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ${
                    isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isButtonDisabled}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
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
        </div>
      </div>
    </div>
  );
};

export default Login;
