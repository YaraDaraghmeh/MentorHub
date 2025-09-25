import { useState, useRef, useEffect, useContext } from 'react';
import { Calendar } from 'lucide-react';
import { StepperContext } from "../../Context/StepperContext";

// Define the props interface
interface DatePickerProps {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
}

// Define day object interface
interface DayObject {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
}

// DatePicker Component
const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  label, 
  name, 
  placeholder, 
  error 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDate = (date: string): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Generate calendar days
  const generateCalendarDays = (): DayObject[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: DayObject[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for comparison
    const selectedDate = value ? new Date(value) : null;

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();
      const isPast = currentDate.getTime() < today.getTime();

      days.push({
        date: currentDate,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isSelected : isSelected || false,
        isPast
      });
    }
    return days;
  };

  // Handle date selection
  const handleDateSelect = (date: Date): void => {
    onChange({
      target: {
        name,
        value: date.toISOString().split('T')[0]
      }
    } as React.ChangeEvent<HTMLInputElement>);
    setIsOpen(false);
  };

  // Handle month navigation
  const navigateMonth = (direction: number): void => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="form-group" ref={datePickerRef}>
      <label className="form-label">{label}</label>
      <div className="date-picker-container">
        <input
          type="text"
          className={`form-input ${error ? 'error' : ''}`}
          value={formatDate(value || '')}
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
          style={{ cursor: 'pointer' }}
        />
        <div className="date-picker-icon  " onClick={() => setIsOpen(!isOpen)}>
          <Calendar color="black" />
        </div>
      </div>
      
      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="date-picker-header">
            <button 
              type="button"
              className="nav-button"
              onClick={() => navigateMonth(-1)}
            >
              ‹
            </button>
            <span className="month-year">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button 
              type="button"
              className="nav-button"
              onClick={() => navigateMonth(1)}
            >
              ›
            </button>
          </div>
          
          <div className="date-picker-grid">
            {dayNames.map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
            
            {days.map((dayObj, index) => (
              <button
                key={index}
                type="button"
                className={`
                  day-button 
                  ${!dayObj.isCurrentMonth ? 'other-month' : ''}
                  ${dayObj.isToday ? 'today' : ''}
                  ${dayObj.isSelected ? 'selected' : ''}
                  ${dayObj.isPast ? 'past' : ''}
                `}
                onClick={() => !dayObj.isPast && handleDateSelect(dayObj.date)}
                disabled={dayObj.isPast}
              >
                {dayObj.day}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <span className="error-message">{error}</span>
      )}

      <style>{`
        .form-group {
          margin-bottom: 1rem;
          position: relative;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .date-picker-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #d0d5dd;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;
          background: #fff;
          color: #06171c;
        }

        .form-input:focus {
          outline: none;
          border-color: #56e39f;
          box-shadow: 0 0 0 3px rgba(86, 227, 159, 0.1);
        }

        .form-input:hover {
          border-color: #00a896;
        }

        .form-input.error {
          border-color: #cd1635;
        }

        .date-picker-icon {
          position: absolute;
          right: 0.75rem;
          cursor: pointer;
          font-size: 1.2rem;
          color: #00a896;
        }

        .date-picker-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          background: #fff;
          border: 1px solid #d0d5dd;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px -5px rgba(6, 23, 28, 0.15);
          padding: 1.25rem;
          min-width: 300px;
        }

        .date-picker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eae9ed;
        }

        .nav-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
          color: #06171c;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-button:hover {
          background-color: #f4f9f9;
          color: #00a896;
        }

        .month-year {
          font-weight: 600;
          color: #06171c;
          font-size: 1.1rem;
        }

        .date-picker-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.125rem;
        }

        .day-header {
          text-align: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475467;
          padding: 0.75rem 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .day-button {
          background: none;
          border: none;
          padding: 0.5rem;
          text-align: center;
          cursor: pointer;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          min-height: 2.5rem;
          color: #06171c;
          position: relative;
        }

        .day-button:hover:not(:disabled) {
          background-color: #f4f9f9;
          color: #00a896;
        }

        .day-button.other-month {
          color: #bfbfbf;
        }

        .day-button.today {
          background-color: #96fbf1;
          color: #06171c;
          font-weight: 700;
          border: 2px solid #0adec9;
        }

        .day-button.today:hover {
          background-color: #0adec9;
          color: #fff;
        }

        .day-button.selected {
          background-color: #56e39f;
          color: #06171c;
          font-weight: 700;
        }

        .day-button.selected:hover {
          background-color: #27b467;
          color: #fff;
        }

        .day-button.past {
          color: #bfbfbf;
          cursor: not-allowed;
          background-color: transparent;
        }

        .day-button.past:hover {
          background-color: transparent;
          color: #bfbfbf;
        }

        .day-button:disabled {
          cursor: not-allowed;
        }

        .error-message {
          color: #cd1635;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
        }
      `}</style>
    </div>
  );
};

 DatePicker;

const Available = () => {
  const { userData, setUserData } = useContext(StepperContext);

  const [formData, setFormData] = useState({
    sessionDate: userData?.sessionDate || '',
    startTime: userData?.startTime || '',
    endTime: userData?.endTime || ''
  });

  // Sync formData with userData when userData changes
  useEffect(() => {
    setFormData({
      sessionDate: userData?.sessionDate || '',
      startTime: userData?.startTime || '',
      endTime: userData?.endTime || ''
    });
  }, [userData?.sessionDate, userData?.startTime, userData?.endTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);

    // Automatically update parent component's state
    updateParentData(updatedFormData);
  };

  const formatDateTimeForAPI = (dateStr: string, timeStr: string): string => {
    if (!dateStr || !timeStr) return '';

    // Parse the date and time components
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    // Create date object in UTC (this ensures the time is interpreted as UTC)
    const utcDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));

    // Format to ISO string and remove milliseconds, add Z suffix
    return utcDateTime.toISOString().split('.')[0] + '.000Z';
  };

  const updateParentData = (data: typeof formData) => {
    // Validate that all required fields are filled
    if (!data.sessionDate || !data.startTime || !data.endTime) {
      return; // Don't update parent if required fields are missing
    }

    // Validate that end time is after start time
    if (data.startTime >= data.endTime) {
      return; // Don't update parent if end time is not after start time
    }

    // Format dates for API
    const startDateTime = formatDateTimeForAPI(data.sessionDate, data.startTime);
    const endDateTime = formatDateTimeForAPI(data.sessionDate, data.endTime);

    // Update parent component's state with the availability data
    setUserData({
      ...userData,
      sessionDate: data.sessionDate,
      startTime: data.startTime,
      endTime: data.endTime,
      // Also store the formatted versions for the API
      startTimeFormatted: startDateTime,
      endTimeFormatted: endDateTime
    });

    console.log('Availability Data Updated:', {
      startTime: data.startTime,
      endTime: data.endTime,
      startTimeFormatted: startDateTime,
      endTimeFormatted: endDateTime
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', color: '#374151' }}>Set Availability</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <DatePicker
          value={formData.sessionDate}
          onChange={handleChange}
          label="Session Date"
          name="sessionDate"
          placeholder="Select session date"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
            Start Time
          </label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
            End Time
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            min={formData.startTime}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
            required
          />
        </div>
      </div>
    </div>
  );
};
export default Available;