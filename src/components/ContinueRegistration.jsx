import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";

const API_URL = "https://paylynk-1.onrender.com/api/auth";

const ContinueRegistration = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const requestOtp = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/resume-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to request verification code"
        );
      }

      setMessage(
        data.message ||
          "If an eligible registration exists, a verification code will be sent."
      );

      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/verify-resume-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "OTP verification failed"
        );
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify(data.user)
        );
      }

      localStorage.removeItem("userId");
      localStorage.removeItem("tempEmail");
      localStorage.removeItem("tempPhone");

      navigate(data.nextStep || "/enter-bvn", {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1c2d] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10263f] p-6 text-white shadow-2xl sm:p-8">

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="mb-8 flex items-center gap-2 text-sm text-gray-300 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Signup
        </button>

        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
          {step === "email" ? (
            <Mail size={28} />
          ) : (
            <ShieldCheck size={28} />
          )}
        </div>

        <h1 className="mb-3 text-2xl font-bold">
          {step === "email"
            ? "Continue Registration"
            : "Verify Your Email"}
        </h1>

        <p className="mb-7 text-sm leading-6 text-gray-300">
          {step === "email"
            ? "Enter the email address you used when you started registering with Paylynk."
            : "If your registration is eligible, a verification code has been sent to your email address."}
        </p>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-400/30 bg-green-500/10 p-3 text-sm text-green-300"
          >
            {message}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={requestOtp}>
            <label
              htmlFor="recovery-email"
              className="mb-2 block text-sm font-medium"
            >
              Email Address
            </label>

            <input
              id="recovery-email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-5 w-full rounded-xl border border-gray-600 bg-[#0b1c2d] px-4 py-3 text-white outline-none focus:border-orange-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 py-3 font-semibold transition hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Please wait..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <label
              htmlFor="recovery-otp"
              className="mb-2 block text-sm font-medium"
            >
              Verification Code
            </label>

            <input
              id="recovery-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="000000"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              className="mb-5 w-full rounded-xl border border-gray-600 bg-[#0b1c2d] px-4 py-3 text-center text-2xl tracking-[0.4em] text-white outline-none focus:border-orange-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 py-3 font-semibold transition hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <div className="mt-5 flex justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
                className="text-gray-300 hover:text-white"
              >
                Change Email
              </button>

              <button
                type="button"
                onClick={requestOtp}
                disabled={loading}
                className="font-medium text-orange-400 hover:text-orange-300 disabled:opacity-60"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-400">
          Already completed registration?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-orange-400 hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default ContinueRegistration;
