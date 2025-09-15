import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, Star, MapPin, CheckCircle } from 'lucide-react';
import type {  BookingModalProps,Mentor } from '../../types/types';

const BookingModal = ({ isOpen, onClose, mentor, isDark }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState('interview-prep');
  const [duration, setDuration] = useState('60');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [step, setStep] = useState(1);

  if (!isOpen || !mentor) return null;

  const sessionTypes = [
    { value: 'interview-prep', label: 'Interview Preparation', price: mentor.hourlyRate },
    { value: 'resume-review', label: 'Resume Review', price: mentor.hourlyRate * 0.8 },
    { value: 'career-guidance', label: 'Career Guidance', price: mentor.hourlyRate * 0.9 },
    { value: 'mock-interview', label: 'Mock Interview', price: mentor.hourlyRate * 1.1 }
  ];

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  const calculateTotal = () => {
    const sessionPrice = sessionTypes.find(type => type.value === sessionType)?.price || mentor.hourlyRate;
    const durationMultiplier = parseInt(duration) / 60;
    return Math.round(sessionPrice * durationMultiplier);
  };

  const handleBooking = () => {
    setStep(2);
  };

  const handleConfirm = () => {
    // Here you would typically send the booking data to your backend
    console.log('Booking confirmed:', {
      mentorId: mentor.id,
      date: selectedDate,
      time: selectedTime,
      sessionType,
      duration,
      total: calculateTotal(),
      notes: additionalNotes
    });
    onClose();
    setStep(1);
    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSessionType('interview-prep');
    setDuration('60');
    setAdditionalNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <h2 className="text-2xl font-bold">
            {step === 1 ? 'Book a Session' : 'Confirm Booking'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            // Step 1: Booking Form
            <>
              {/* Mentor Info */}
              <div className={`p-4 rounded-xl mb-6 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                    isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {mentor.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{mentor.name}</h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {mentor.title} at {mentor.company}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{mentor.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{mentor.location}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>${mentor.hourlyRate}/hour</span>
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
                    <label className="block text-sm font-medium mb-3">Session Type</label>
                    <div className="space-y-2">
                      {sessionTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            sessionType === type.value
                              ? isDark 
                                ? 'border-blue-500 bg-blue-900/20' 
                                : 'border-blue-500 bg-blue-50'
                              : isDark 
                                ? 'border-gray-600 hover:border-gray-500' 
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="sessionType"
                              value={type.value}
                              checked={sessionType === type.value}
                              onChange={(e) => setSessionType(e.target.value)}
                              className="mr-3"
                            />
                            <span>{type.label}</span>
                          </div>
                          <span className="font-semibold">${type.price}/hr</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={`w-full p-3 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Select Date</label>
                    <div className="grid grid-cols-2 gap-2">
                      {getNextWeekDates().map((date) => (
                        <button
                          key={date.value}
                          onClick={() => setSelectedDate(date.value)}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            selectedDate === date.value
                              ? isDark 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-blue-500 text-white'
                              : isDark 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {date.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Select Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            selectedTime === time
                              ? isDark 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-blue-500 text-white'
                              : isDark 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
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
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Booking Summary */}
              <div className={`mt-6 p-4 rounded-xl ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span>Session ({duration} minutes)</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-gray-300">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className={`w-full mt-6 py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  selectedDate && selectedTime
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isDark 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Book Session
              </button>
            </>
          ) : (
            // Step 2: Confirmation
            <div className="text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Booking Confirmed!</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your session has been successfully booked.
                </p>
              </div>

              <div className={`text-left p-6 rounded-xl mb-6 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h4 className="font-semibold mb-4">Session Details:</h4>
                <div className="space-y-2">
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
                    <span>{sessionTypes.find(t => t.value === sessionType)?.label}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-gray-300">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                You'll receive a confirmation email shortly with meeting details and payment information.
              </p>

              <button
                onClick={handleConfirm}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};