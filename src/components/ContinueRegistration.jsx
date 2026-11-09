
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";
import phone from "./phone.png";

const API_URL = "https://paylynk-1.onrender.com/api/auth";

const ContinueRegistration = () => {
  const navigate = useNavigate();

  // ==========================
  // STATES
  // ==========================
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================
  // REQUEST / RESEND OTP
  // ==========================
  const requestOtp = async (event) => {
    event?.preventDefault();

    if (loading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

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
            email: normalizedEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to request verification code."
        );
      }

      setMessage(
        data.message ||
          "If an eligible registration exists, a verification code will be sent."
      );

      setOtp("");
      setStep("otp");
    } catch (err) {
      console.error("REQUEST OTP ERROR:", err);

      setError(
        err.message ||
          "Unable to request a verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // VERIFY OTP
  // ==========================
  const verifyOtp = async (event) => {
    event.preventDefault();

    if (loading) return;

    const normalizedOtp = otp.trim();

    if (!/^\d{6}$/.test(normalizedOtp)) {
      setError("Please enter a valid 6-digit verification code.");
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
            otp: normalizedOtp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Verification failed. Please check your code."
        );
      }

      if (!data.token) {
        throw new Error(
          "Verification succeeded, but no authentication token was returned."
        );
      }

      // ==========================
      // SAVE AUTHENTICATION
      // ==========================
      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify(data.user)
        );

        if (data.user.name) {
          localStorage.setItem(
            "epay_user_name",
            data.user.name
          );
        }
      }

      // Remove temporary registration data
      localStorage.removeItem("userId");
      localStorage.removeItem("tempEmail");
      localStorage.removeItem("tempPhone");

      // ==========================
      // CONTINUE REGISTRATION
      // ==========================
      const allowedRoutes = [
        "/enter-bvn",
        "/select-bank",
        "/enter-account",
        "/account-verification",
        "/dashboard",
      ];

      const nextStep = allowedRoutes.includes(
        data.nextStep
      )
        ? data.nextStep
        : "/enter-bvn";

      navigate(nextStep, {
        replace: true,
      });
    } catch (err) {
      console.error("VERIFY OTP ERROR:", err);

      setError(
        err.message ||
          "Unable to verify your code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // CHANGE EMAIL
  // ==========================
  const handleChangeEmail = () => {
    if (loading) return;

    setStep("email");
    setOtp("");
    setError("");
    setMessage("");
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

      {/* ==========================
          LEFT: REGISTRATION PANEL
      ========================== */}
      <div className="flex min-h-screen items-center justify-center bg-[#0b1c2d] px-6 py-10">

        <div className="w-full max-w-md text-white">

          {/* BRAND */}
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">
              Paylynk
              <span className="text-orange-500">.</span>
            </h2>

            <p className="mt-1 text-xs tracking-widest text-gray-400">
              YOUR MONEY. YOUR CONTROL.
            </p>
          </div>

          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="mb-8 flex items-center gap-2 text-sm text-gray-300 transition hover:text-orange-400"
          >
            <ArrowLeft size={18} />
            Back to Signup
          </button>

          {/* STEP INDICATOR */}
          <div className="mb-8 flex items-center gap-3">

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                step === "email"
                  ? "bg-orange-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {step === "email" ? (
                <Mail size={19} />
              ) : (
                <CheckCircle2 size={19} />
              )}
            </div>

            <div
              className={`h-1 flex-1 rounded-full ${
                step === "otp"
                  ? "bg-orange-500"
                  : "bg-white/10"
              }`}
            />

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                step === "otp"
                  ? "bg-orange-500 text-white"
                  : "bg-[#10263f] text-gray-400"
              }`}
            >
              <ShieldCheck size={19} />
            </div>

          </div>

          {/* TITLE */}
          <h1 className="mb-3 text-3xl font-bold">
            {step === "email"
              ? "Continue Registration"
              : "Verify Your Email"}
          </h1>

          {/* DESCRIPTION */}
          <p className="mb-8 text-sm leading-7 text-gray-300">
            {step === "email"
              ? "Already started creating your Paylynk account? Enter the email address you registered with to continue where you left off."
              : `Enter the 6-digit verification code requested for ${email.trim().toLowerCase()}. If your registration is eligible, the code will be sent to your inbox.`}
          </p>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
            >
              {error}
            </div>
          )}

          {/* SUCCESS / INFORMATION MESSAGE */}
          {message && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm leading-6 text-green-300"
            >
              {message}
            </div>
          )}

          {/* ==========================
              EMAIL STEP
          ========================== */}
          {step === "email" ? (

            <form onSubmit={requestOtp}>

              <div className="mb-6">

                <label
                  htmlFor="recovery-email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Registered Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="recovery-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    disabled={loading}
                    className="w-full rounded-full border border-white/10 bg-[#10263f] py-4 pl-12 pr-5 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 disabled:opacity-60"
                  />

                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#FE3737] py-4 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw
                      size={19}
                      className="animate-spin"
                    />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

            </form>

          ) : (

            /* ==========================
                OTP VERIFICATION STEP
            ========================== */
            <form onSubmit={verifyOtp}>

              <div className="mb-5">

                <label
                  htmlFor="recovery-otp"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Verification Code
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="recovery-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    disabled={loading}
                    className="w-full rounded-full border border-white/10 bg-[#10263f] py-4 pl-12 pr-5 text-center text-2xl tracking-[0.3em] text-white outline-none transition placeholder:text-gray-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 disabled:opacity-60"
                  />

                </div>
              </div>

              <p className="mb-7 flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck
                  size={16}
                  className="text-orange-400"
                />
                Verification codes expire after 5 minutes.
              </p>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#FE3737] py-4 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw
                      size={19}
                      className="animate-spin"
                    />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

              {/* OTP ACTIONS */}
              <div className="mt-6 flex items-center justify-between gap-4 text-sm">

                <button
                  type="button"
                  onClick={handleChangeEmail}
                  disabled={loading}
                  className="text-gray-300 transition hover:text-white disabled:opacity-60"
                >
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={loading}
                  className="flex items-center gap-2 font-medium text-orange-400 transition hover:text-orange-300 disabled:opacity-60"
                >
                  <RefreshCw size={15} />
                  Resend Code
                </button>

              </div>

            </form>
          )}

          {/* SECURITY NOTICE */}
          <div className="mt-9 rounded-xl border border-white/10 bg-[#10263f] p-4">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-orange-400"
              />

              <div>
                <h3 className="mb-1 text-sm font-semibold">
                  Your Security Matters
                </h3>

                <p className="text-xs leading-6 text-gray-400">
                  Never share your verification code
                  with anyone. Paylynk will never ask
                  you to disclose your OTP.
                </p>
              </div>

            </div>
          </div>

          {/* LOGIN LINK */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Already completed registration?{" "}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-orange-400 transition hover:text-orange-300 hover:underline"
            >
              Log In
            </button>
          </p>

          {/* COPYRIGHT */}
          <p className="mt-10 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Paylynk.
            All rights reserved.
          </p>

        </div>
      </div>

      {/* ==========================
          RIGHT: PROMOTIONAL PANEL
      ========================== */}
      <div className="hidden min-h-screen items-center justify-center bg-white px-10 py-12 lg:flex">

        <div className="w-full max-w-md">

          {/* BADGE */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-600">
            <ShieldCheck size={16} />
            SECURE ACCOUNT REGISTRATION
          </div>

          {/* HEADING */}
          <h2 className="mb-5 text-4xl font-extrabold leading-tight text-[#0b1c2d]">
            Your financial journey
            <span className="block text-orange-500">
              continues here.
            </span>
          </h2>

          {/* DESCRIPTION */}
          <p className="mb-8 text-base leading-8 text-gray-600">
            Complete your Paylynk registration
            and get closer to managing your finances
            with confidence, convenience, and security.
          </p>

          {/* FEATURES */}
          <div className="mb-8 grid grid-cols-2 gap-4">

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

              <ShieldCheck
                size={25}
                className="mb-3 text-orange-500"
              />

              <h3 className="mb-2 font-bold text-[#0b1c2d]">
                Secure Verification
              </h3>

              <p className="text-xs leading-6 text-gray-500">
                Protect your account with secure
                email verification.
              </p>

            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

              <Mail
                size={25}
                className="mb-3 text-orange-500"
              />

              <h3 className="mb-2 font-bold text-[#0b1c2d]">
                Easy Recovery
              </h3>

              <p className="text-xs leading-6 text-gray-500">
                Continue your registration
                without starting all over.
              </p>

            </div>

          </div>

          {/* PHONE PREVIEW */}
          <div className="relative flex justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50 to-white p-6">

            <div className="absolute left-8 top-10 h-28 w-28 rounded-full bg-orange-200/40 blur-3xl" />

            <div className="absolute bottom-8 right-8 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl" />

            <img
              src={phone}
              alt="Paylynk mobile app preview"
              className="relative z-10 mx-auto w-full max-w-[280px] object-contain drop-shadow-xl"
            />

          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Your money. Your control. Your Paylynk.
          </p>

        </div>
      </div>

    </div>
  );
};

export default ContinueRegistration;
