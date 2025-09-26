import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiMail,
  FiCheck,
  FiArrowLeft,
  FiSend,
  FiLock,
  FiAlertCircle,
} from "react-icons/fi";
import PasswordResetService from "../../Services/passwordResetService";

const ForgotPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check if this is a password reset link (has email and token)
  const emailFromUrl = searchParams.get("email");
  const tokenFromUrl = searchParams.get("token");

  // State management
  const [step, setStep] = useState<number>(
    emailFromUrl && tokenFromUrl ? 2 : 1
  );
  const [email, setEmail] = useState<string>(emailFromUrl || "");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  }>();

  // Check if the URL has a reset token
  useEffect(() => {
    if (emailFromUrl && tokenFromUrl) {
      // Pre-fill email if coming from reset link and go directly to password reset
      setEmail(emailFromUrl);
      setStep(2);
    }
  }, [emailFromUrl, tokenFromUrl]);

  // Step 1: Request password reset email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Please enter your email address", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(undefined);

    try {
      const result = await PasswordResetService.requestPasswordReset(email);

      if (result.success) {
        setMessage({
          text: "Password reset link has been sent to your email",
          type: "success",
        });
      } else {
        setMessage({
          text: result.message,
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again later",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage({ text: "Please fill in all password fields", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters long",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(undefined);

    try {
      const token = tokenFromUrl || "";
      const result = await PasswordResetService.resetPassword(
        email,
        token,
        newPassword
      );

      if (result.success) {
        setMessage({
          text: "Password has been reset successfully",
          type: "success",
        });

        // Redirect to login after successful password reset
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage({
          text: result.message,
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "Failed to reset password. Please request a new link",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Email input form
  const renderEmailForm = () => (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50">
            <FiMail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Forgot Your Password?
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleEmailSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black dark:text-gray-900 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full py-3 pl-10 pr-4 text-gray-900 dark:text-black bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-black"
                : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <FiCheck className="w-5 h-5 mr-3 flex-shrink-0" />
              ) : (
                <FiAlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center py-3 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
            loading ? "opacity-75 cursor-not-allowed" : "hover:shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <FiSend className="w-4 h-4 mr-2" />
              Send Reset Link
            </>
          )}
        </button>
      </form>
    </div>
  );

  // Step 2: Password reset form
  const renderPasswordResetForm = () => (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50">
            <FiLock className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Set New Password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create a new password for your account
        </p>
        <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
          {email}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handlePasswordSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-900 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full py-3 pl-10 pr-4 text-gray-900 dark:text-black bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter new password"
              />
            </div>
            {newPassword && newPassword.length < 6 && (
              <p className="mt-1 text-xs text-black dark:text-black flex items-center">
                <FiAlertCircle className="w-3 h-3 mr-1" />
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-900 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full py-3 pl-10 pr-4 text-gray-900 dark:text-black bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Confirm new password"
              />
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center">
                <FiAlertCircle className="w-3 h-3 mr-1" />
                Passwords do not match
              </p>
            )}
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
                : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <FiCheck className="w-5 h-5 mr-3 flex-shrink-0" />
              ) : (
                <FiAlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={
              loading ||
              !newPassword ||
              newPassword !== confirmPassword ||
              newPassword.length < 6
            }
            className={`w-full flex items-center justify-center py-3 px-4 text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${
              loading ||
              !newPassword ||
              newPassword !== confirmPassword ||
              newPassword.length < 6
                ? "opacity-75 cursor-not-allowed"
                : "hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4 mr-2" />
                Reset Password
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            MentorHub
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Secure Password Recovery
          </p>
        </div>

        {/* Progress Indicator - Only show for multi-step flow */}
        {!emailFromUrl && !tokenFromUrl && (
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= 1
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {step > 1 ? <FiCheck className="w-4 h-4" /> : "1"}
              </div>
              <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                Email
              </span>
            </div>
            <div
              className={`w-12 h-0.5 ${
                step > 1 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= 2
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {step > 2 ? <FiCheck className="w-4 h-4" /> : "2"}
              </div>
              <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                Reset
              </span>
            </div>
          </div>
        )}

        {/* Form Content */}
        {step === 1 && renderEmailForm()}
        {step === 2 && renderPasswordResetForm()}

        {/* Footer Link - Only show on email step */}
        {step === 1 && (
          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
