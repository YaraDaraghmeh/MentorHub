import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ContactUsProps {
  isDark?: boolean;
}

const ContactUs: React.FC<ContactUsProps> = ({ isDark = false }) => {
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
          to: "yaradaraghmeh059@gmail.com",
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
    const mailtoLink = `mailto:yaradaraghmeh059@gmail.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `From: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.open(mailtoLink, "_blank");
    setFormData({ subject: "", email: "", message: "" });
    setSubmitStatus("success");
  };

  const themeClasses = {
    bg: isDark ? "bg-[#06171c]" : "bg-[#96fbf1]",
    cardBg: isDark
      ? "bg-gray-800/90 backdrop-blur-sm"
      : "bg-white/90 backdrop-blur-sm",
    text: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
    border: isDark ? "border-gray-700/50" : "border-white/50",
    input: isDark
      ? "bg-gray-700/80 border-gray-600/50 text-white placeholder-gray-400"
      : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-blue-600 hover:bg-blue-700"
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
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <br />
          <br />

          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${themeClasses.text} mb-4 drop-shadow-lg`}
          >
            Contact Mentor Hub
          </h1>
          <p
            className={`text-lg sm:text-xl ${themeClasses.textSecondary} max-w-2xl mx-auto drop-shadow-sm`}
          >
            Connect with experienced interview trainers and boost your career
            success. We're here to help you prepare for your next opportunity.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${themeClasses.cardBg} rounded-2xl p-6 sm:p-8 shadow-xl border ${themeClasses.border}`}
          >
            <h2
              className={`text-2xl sm:text-3xl font-bold ${themeClasses.text} mb-6`}
            >
              Get in Touch
            </h2>

            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r ${themeClasses.gradientCard} backdrop-blur-sm`}
              >
                <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className={`font-semibold ${themeClasses.text} mb-1`}>
                    Email Us
                  </h3>
                  <p
                    className={`${themeClasses.textSecondary} text-sm sm:text-base`}
                  >
                    yaradaraghmeh059@gmail.com
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r ${themeClasses.gradientCard2} backdrop-blur-sm`}
              >
                <MessageCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className={`font-semibold ${themeClasses.text} mb-1`}>
                    Support
                  </h3>
                  <p
                    className={`${themeClasses.textSecondary} text-sm sm:text-base`}
                  >
                    Get help with booking sessions, technical issues, or general
                    inquiries
                  </p>
                </div>
              </motion.div>
            </div>

            <div
              className={`mt-8 p-6 rounded-xl bg-gradient-to-br ${themeClasses.gradientCard3} border ${themeClasses.border} backdrop-blur-sm`}
            >
              <h3 className={`font-semibold ${themeClasses.text} mb-3`}>
                About Mentor Hub
              </h3>
              <p
                className={`${themeClasses.textSecondary} text-sm leading-relaxed`}
              >
                Our platform specializes in connecting job seekers with
                experienced interview trainers across various industries. Book
                personalized mock interview sessions and receive professional
                coaching to improve your interview performance.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${themeClasses.cardBg} rounded-2xl p-6 sm:p-8 shadow-xl border ${themeClasses.border}`}
          >
            <h2
              className={`text-2xl sm:text-3xl font-bold ${themeClasses.text} mb-6`}
            >
              Send us a Message
            </h2>

            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center space-x-3 backdrop-blur-sm`}
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300 text-sm">
                  Message sent successfully! We'll get back to you soon.
                </p>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-3 backdrop-blur-sm`}
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300 text-sm">
                  There was an error sending your message. Please try the email
                  option below.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium ${themeClasses.text}  !text-gray-600 mb-2`}
                >
                  Your Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input}  !text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm`}
                  placeholder="your.email@example.com"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label
                  htmlFor="subject"
                  className={`block text-sm font-medium ${themeClasses.text}  !text-gray-600 mb-2`}
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input} !text-black  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm`}
                  placeholder="What's this about?"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label
                  htmlFor="message"
                  className={`block text-sm font-medium ${themeClasses.text} !text-gray-600 mb-2`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical backdrop-blur-sm`}
                  placeholder="Tell us how we can help you..."
                />
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-3 ">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 ${themeClasses.button} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg !bg-[#1c6b82]`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin !bg-[#1c6b82]" />
                  ) : (
                    <>
                      <Send className="w-5 h-5 !bg-[#1c6b82]" />
                    </>
                  )}
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleMailtoFallback}
                  className={`flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg`}
                >
                  <Mail className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
