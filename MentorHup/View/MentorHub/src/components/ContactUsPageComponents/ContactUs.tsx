import React, { useState } from "react";
import { useTheme } from "../../Context/ThemeContext";

import {
  Mail,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ContactUs: React.FC = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    subject: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "c5441a55-28e9-4729-9878-e91e3929a39d",
          name: "MentorHub Contact Form",
          email: formData.email,
          subject: `[MentorHub Contact] ${formData.subject}`,
          message: `
New contact form submission from MentorHub:

From: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
Sent via MentorHub Contact Form
          `.trim(),
          from_name: "MentorHub Contact Form",
          replyto: formData.email,
          to: "yaradaraghmeh056@gmail.com",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setFormData({ subject: "", email: "", message: "" });
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMailtoFallback = () => {
    const mailtoLink = `mailto:yaradaraghmeh056@gmail.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `From: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.open(mailtoLink, "_blank");
    setFormData({ subject: "", email: "", message: "" });
    setSubmitStatus("success");
  };

  const themeClasses = {
    bg: isDark ? "bg-[var(--primary-rgba)]" : "bg-[#96fbf1]",
    cardBg: isDark
      ? "bg-gray-800/90 backdrop-blur-sm"
      : "bg-white/90 backdrop-blur-sm",
    text: isDark ? "text-gray-300" : "text-gray-900",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
    border: isDark ? "border-gray-700/50" : "border-white/50",
    input: isDark
      ? "bg-gray-700/80 border-gray-600/50 text-white placeholder-gray-400"
      : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-[#1e874e] hover:bg-[#071b21]"
      : "bg-blue-600 hover:bg-blue-700",
    gradientCard: isDark
      ? "from-blue-900/30 to-indigo-900/30"
      : "from-blue-50/80 to-indigo-50/80",
    gradientCard2: isDark
      ? "from-green-900/30 to-emerald-900/30"
      : "from-green-50/80 to-emerald-50/80",
    gradientCard3: isDark
      ? "from-purple-900/30 to-pink-900/30"
      : "from-purple-50/80 to-pink-50/80",
  };

  return (
    <div
      className={`min-h-screen ${themeClasses.bg} py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-teal-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 pt-16">
          <br />
          <br />
          <br />
          <br />

          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${themeClasses.text} mb-6 drop-shadow-lg bg-gradient-to-r from-[#96fbf1] via-[#1e874e] to-[#071b21] bg-clip-text text-transparent animate-pulse`}
          >
            Contact Mentor Hub
          </h1>
          <p
            className={`text-lg sm:text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto drop-shadow-sm`}
          >
            Connect with experienced interview trainers and boost your career
            success. We're here to help you prepare for your next opportunity.
          </p>
        </div>

        {/* Enhanced Contact Form */}
        <div className="lg:col-span-3">
          <div
            className={`${themeClasses.cardBg} rounded-4xl p-8 shadow-2xl border ${themeClasses.border} transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}
          >
            {/* Form Header with Decorative Elements */}
            <div className="relative mb-8">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-full opacity-20 blur-xl"></div>
              <h2
                className={`text-3xl font-bold ${themeClasses.text} text-center relative z-10`}
              >
                Send us a Message
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#1c6b82] to-[#0adec9] mx-auto mt-4 rounded-full"></div>
            </div>

            {submitStatus === "success" && (
              <div
                className={`mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center space-x-3 backdrop-blur-sm animate-pulse`}
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-[#1e874e] text-sm">
                  Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div
                className={`mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center space-x-3 backdrop-blur-sm animate-pulse`}
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300 text-sm">
                  There was an error sending your message. Please try the email
                  option below.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Enhanced Form Fields */}
              <div className="relative group">
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium ${themeClasses.text} mb-3 transition-colors group-focus-within:text-blue-600`}
                >
                  Your Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-6 py-4 rounded-3xl !text-black border-2 ${themeClasses.input} focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                    placeholder="your.email@example.com"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="relative group">
                <label
                  htmlFor="subject"
                  className={`block text-sm font-medium ${themeClasses.text} mb-3 transition-colors group-focus-within:text-blue-600`}
                >
                  Subject
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-6 py-4 rounded-3xl border-2 !text-black ${themeClasses.input} focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                    placeholder="What's this about?"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-600/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="relative group">
                <label
                  htmlFor="message"
                  className={`block text-sm font-medium ${themeClasses.text} mb-3 transition-colors group-focus-within:text-blue-600`}
                >
                  Message
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full px-6 py-4 rounded-3xl border-2 ${themeClasses.input} focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-vertical backdrop-blur-sm text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                    placeholder="Tell us how we can help you..."
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Enhanced Button Section */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-[#1c6b82] to-[#0adec9] hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-3xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span className="text-lg">Send Message</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleMailtoFallback}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-8 rounded-3xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Mail className="w-5 h-5" />
                  <span className="text-lg">Email Direct</span>
                </button>
              </div>
            </form>

            {/* Decorative Bottom Elements */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full opacity-10 blur-2xl"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full opacity-10 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
