import React, { useState } from "react";
import type { Mentor } from "../../types/types";

import {
  X,
  Star,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Type definitions
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor;
  isDark: boolean;
}

interface MockPaymentIntent {
  id: string;
  amount: number;
  status: string;
}

interface BookingData {
  id: number;
  date: string;
  time: string;
  sessionType: string;
  duration: string;
  total: number;
  notes: string;
}

const mockUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "JD",
};

const PaymentForm = ({
  bookingData,
  isDark,
  onSuccess,
  onError,
  onBack,
}: {
  bookingData: BookingData;
  isDark: boolean;
  onSuccess: (paymentIntent: MockPaymentIntent) => void;
  onError: (error: string) => void;
  onBack: () => void;
}) => {
  const handleMockPayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      if (success) {
        onSuccess({
          id: `pi_${Date.now()}`,
          amount: bookingData.total * 100, // Stripe uses cents
          status: "succeeded",
        });
      } else {
        onError(
          "Your card was declined. Please try a different payment method."
        );
      }
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className={`px-6 py-3 rounded-lg border font-medium ${
            isDark
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Back
        </button>
        <button
          onClick={handleMockPayment}
          className="flex-1 py-3 px-6 bg-[#27b467] hover:bg-[#1e874e] text-white rounded-lg font-semibold transition-colors"
        >
          Process Payment (${bookingData.total})
        </button>
      </div>
    </div>
  );
};

const BookingModal = ({
  isOpen,
  onClose,
  mentor,
  isDark,
}: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("mock-interview"); // Default to mock-interview
  const [duration, setDuration] = useState("60");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: payment, 3: success, 4: error
  const [paymentError, setPaymentError] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  // Get current user from system
  const currentUser = mockUserData;

  if (!isOpen || !mentor) return null;

  const sessionTypes = [
    {
      value: "interview-prep",
      label: "Interview Preparation",
      price: mentor.price,
      disabled: true, // Disabled
    },
    {
      value: "resume-review",
      label: "Resume Review",
      price: mentor.price * 0.8,
      disabled: true, // Disabled
    },
    {
      value: "career-guidance",
      label: "Career Guidance",
      price: mentor.price * 0.9,
      disabled: true, // Disabled
    },
    {
      value: "mock-interview",
      label: "Mock Interview",
      price: mentor.price * 1.1,
      disabled: false, // Only this one is enabled
    },
  ];

  // const availableTimes = [
  //   "09:00 AM",
  //   "10:00 AM",
  //   "11:00 AM",
  //   "01:00 PM",
  //   "02:00 PM",
  //   "03:00 PM",
  //   "04:00 PM",
  //   "05:00 PM",
  // ];

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
    return dates;
  };

  const calculateTotal = () => {
    const sessionPrice =
      sessionTypes.find((type) => type.value === sessionType)?.price ||
      mentor.price;
    const durationMultiplier = parseInt(duration) / 60;
    return Math.round(sessionPrice * durationMultiplier);
  };

  const handleBooking = () => {
    setStep(2);
  };

  const handlePaymentSuccess = (paymentIntent: MockPaymentIntent) => {
    setPaymentIntentId(paymentIntent.id);
    setStep(3);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setStep(4);
  };

  const resetModal = () => {
    setStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setSessionType("mock-interview"); // Reset to default enabled type
    setDuration("60");
    setAdditionalNotes("");
    setPaymentError("");
    setPaymentIntentId("");
    onClose();
  };

  const bookingData: BookingData = {
    id: mentor.id,
    date: selectedDate,
    time: selectedTime,
    sessionType,
    duration,
    total: calculateTotal(),
    notes: additionalNotes,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 flex items-center justify-between p-6 border-b ${
            isDark ? "border-gray-700 bg-[#071b21]" : "border-gray-200 bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold">
            {step === 1 && "Book a Session"}
            {step === 2 && "Payment Details"}
            {step === 3 && "Booking Confirmed!"}
            {step === 4 && "Payment Failed"}
          </h2>
          <button
            onClick={resetModal}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <X size={24} />
          </button>
        </div>

        <div className={`p-6 ${isDark ? "bg-[#071b21]" : "bg-gray-50"}`}>
          {step === 1 && (
            // Step 1: Booking Form
            <>
              {/* Mentor Info */}
              <div
                className={`p-4 rounded-xl mb-6 ${
                  isDark ? "bg-[#071b21]" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                      isDark
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {mentor.imageLink}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{mentor.name}</h3>
                    <p
                      className={`${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {mentor.field} at {mentor.companyName}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{mentor.reviewCount}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>${mentor.price}/hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Session Type */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Session Type
                    </label>
                    <div className="space-y-2">
                      {sessionTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            type.disabled
                              ? // Disabled styles
                                isDark
                                ? "border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed"
                                : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                              : // Enabled styles
                              sessionType === type.value
                              ? isDark
                                ? "border-[#000000] bg-[#09fb7630] cursor-pointer"
                                : "border-[#000000] bg-[#09fb7630] opacity-90 cursor-pointer"
                              : isDark
                              ? "border-gray-600 hover:border-gray-500 cursor-pointer"
                              : "border-gray-200 hover:border-gray-300 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="sessionType"
                              value={type.value}
                              checked={sessionType === type.value}
                              disabled={type.disabled}
                              onChange={(e) => setSessionType(e.target.value)}
                              className="mr-3"
                            />
                            <span
                              className={type.disabled ? "text-gray-400" : ""}
                            >
                              {type.label}
                            </span>
                          </div>
                          <span
                            className={`font-semibold ${
                              type.disabled ? "text-gray-400" : ""
                            }`}
                          >
                            ${type.price}/hr
                          </span>
                          {type.disabled && (
                            <span className="text-xs text-gray-400 ml-2">
                              (Coming Soon)
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={`w-full p-3 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-black"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Select Date
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {getNextWeekDates().map((date) => (
                        <button
                          key={date.value}
                          onClick={() => setSelectedDate(date.value)}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            selectedDate === date.value
                              ? isDark
                                ? "bg-[#27b467] text-white"
                                : "bg-[#27b467] text-white"
                              : isDark
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {date.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Select Time
                    </label>
                    {/* <div className="grid grid-cols-2 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            selectedTime === time
                              ? isDark
                                ? "bg-[#27b467] text-white"
                                : "bg-[#27b467] text-white"
                              : isDark
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-3">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any specific topics or questions you'd like to discuss?"
                  rows={4}
                  className={`w-full p-3 rounded-lg border resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-200 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Booking Summary */}
              <div
                className={`mt-6 p-4 rounded-xl ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span>Session ({duration} minutes)</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-gray-300">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className={`w-full mt-6 py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  selectedDate && selectedTime
                    ? "bg-[#27b467] hover:bg-[#1e874e]text-white"
                    : isDark
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue to Payment
              </button>
            </>
          )}

          {step === 2 && (
            // Step 2: Payment Form with Mock Stripe
            <>
              {/* Booking Summary */}
              <div
                className={`p-4 rounded-xl mb-6 ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>
                      {mentor.name} -{" "}
                      {sessionTypes.find((t) => t.value === sessionType)?.label}
                    </span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-xs opacity-75">
                    <span>
                      {new Date(selectedDate).toLocaleDateString()} at{" "}
                      {selectedTime}
                    </span>
                    <span>{duration} minutes</span>
                  </div>
                </div>
              </div>

              <PaymentForm
                bookingData={bookingData}
                isDark={isDark}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onBack={() => setStep(1)}
              />
            </>
          )}

          {step === 3 && (
            // Step 3: Success
            <div className="text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">
                  Payment Successful!
                </h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Your session has been booked and payment processed.
                </p>
              </div>

              <div
                className={`text-left p-6 rounded-xl mb-6 ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <h4 className="font-semibold mb-4">Session Details:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mentor:</span>
                    <span>{mentor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>
                      {sessionTypes.find((t) => t.value === sessionType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-gray-300">
                    <span>Total Paid:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  {paymentIntentId && (
                    <div className="flex justify-between text-xs opacity-75">
                      <span>Payment ID:</span>
                      <span>{paymentIntentId}</span>
                    </div>
                  )}
                </div>
              </div>

              <p
                className={`text-sm mb-6 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                You'll receive a confirmation email with meeting details and
                calendar invite.
              </p>

              <button
                onClick={resetModal}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {step === 4 && (
            // Step 4: Error
            <div className="text-center">
              <div className="mb-6">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Payment Failed</h3>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } mb-4`}
                >
                  We couldn't process your payment. Please try again.
                </p>
                {paymentError && (
                  <p
                    className={`text-sm p-3 rounded-lg ${
                      isDark
                        ? "bg-red-900/20 text-red-400"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {paymentError}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={resetModal}
                  className={`px-6 py-3 rounded-lg border font-medium ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
