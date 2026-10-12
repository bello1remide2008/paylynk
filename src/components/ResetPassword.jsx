import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please complete both password fields.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Your password must be between 8 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!token) {
      setError("Your reset link is incomplete. Request a new one.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://paylynk-1.onrender.com/api/auth/reset-password/${encodeURIComponent(token)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Password reset failed.");
        return;
      }

      setSuccess("Your password has been reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1800);

    } catch (err) {
      console.error("Reset password request failed:", err);
      setError("Unable to connect to Paylynk. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#081827] px-4 py-10">

      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

        <div className="bg-[#0b1c2d] px-8 py-7 text-center">
          <h1 className="text-3xl font-extrabold tracking-wide text-white">
            Paylynk<span className="text-orange-500">.</span>
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Your money. Your control.
          </p>
        </div>

        <div className="p-7 sm:p-9">

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
            <LockKeyhole className="h-7 w-7 text-orange-600" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Reset your password
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create a new password to secure your Paylynk account.
            Choose a password you have not used elsewhere.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {success}
              <p className="mt-1">
                Redirecting you to login...
              </p>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="mt-7 space-y-5">

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  minLength={8}
                  maxLength={128}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-600"
                >
                  {showPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm new password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password again"
                  maxLength={128}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-600"
                >
                  {showConfirmPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Resetting password..."
              ) : (
                <>
                  <ShieldCheck size={19} />
                  Reset Password
                </>
              )}
            </button>

          </form>

          <div className="mt-7 border-t border-slate-100 pt-5 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Back to Login
            </Link>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            Your security matters. Never share your password or reset link
            with anyone.
          </p>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
