import React from 'react';

interface FormattedDateComponentProps {
  isoDateString: string;
  showDate?: boolean;
  showTime?: boolean;
  timeFormat?: '12' | '24';
  dateFormat?: 'short' | 'long' | 'numeric';
  className?: string;
  separator?: string;
}

interface FormattedDateResult {
  date: string;
  time: string;
  dayOfWeek: string;
  fullDateTime: string;
}

export const FormattedDateComponent: React.FC<FormattedDateComponentProps> = ({
  isoDateString,
  showDate = true,
  showTime = true,
  timeFormat = '12',
  dateFormat = 'short',
  className = '',
  separator = ' at '
}) => {
  const formatDateTime = (isoString: string): FormattedDateResult => {
    try {
      const date = new Date(isoString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return {
          date: 'Invalid Date',
          time: 'Invalid Time',
          dayOfWeek: 'Invalid Day',
          fullDateTime: 'Invalid DateTime'
        };
      }

      // Format time
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: timeFormat === '12'
      };
      const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

      // Format date based on dateFormat prop
      let dateOptions: Intl.DateTimeFormatOptions;
      switch (dateFormat) {
        case 'long':
          dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          };
          break;
        case 'numeric':
          dateOptions = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          };
          break;
        default: // 'short'
          dateOptions = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          };
      }
      
      const formattedDate = date.toLocaleDateString('en-US', dateOptions);
      
      // Get day of week
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Full date time
      const fullDateTime = date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: timeFormat === '12'
      });

      return {
        date: formattedDate,
        time: formattedTime,
        dayOfWeek,
        fullDateTime
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return {
        date: 'Error',
        time: 'Error',
        dayOfWeek: 'Error',
        fullDateTime: 'Error'
      };
    }
  };

  const formatted = formatDateTime(isoDateString);

  const renderContent = () => {
    if (showDate && showTime) {
      return `${formatted.date}${separator}${formatted.time}`;
    } else if (showDate) {
      return formatted.date;
    } else if (showTime) {
      return formatted.time;
    } else {
      return formatted.fullDateTime;
    }
  };

  return (
    <span className={className} title={formatted.fullDateTime}>
      {renderContent()}
    </span>
  );
};

// Utility functions for direct use without component
export const formatDateTimeUtils = {
  /**
   * Extract time only from ISO string
   */
  getTimeOnly: (isoString: string, format12Hour: boolean = true): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: format12Hour
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  },

  /**
   * Extract date only from ISO string
   */
  getDateOnly: (isoString: string, format: 'short' | 'long' | 'numeric' = 'short'): string => {
    try {
      const date = new Date(isoString);
      let options: Intl.DateTimeFormatOptions;
      
      switch (format) {
        case 'long':
          options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          break;
        case 'numeric':
          options = { year: 'numeric', month: '2-digit', day: '2-digit' };
          break;
        default:
          options = { weekday: 'short', month: 'short', day: 'numeric' };
      }
      
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  },

  /**
   * Get day of week from ISO string
   */
  getDayOfWeek: (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } catch (error) {
      console.error('Error getting day of week:', error);
      return 'Invalid Day';
    }
  },

  /**
   * Format time range from start and end ISO strings
   */
  getTimeRange: (startIso: string, endIso: string, format12Hour: boolean = true): string => {
    try {
      const startTime = formatDateTimeUtils.getTimeOnly(startIso, format12Hour);
      const endTime = formatDateTimeUtils.getTimeOnly(endIso, format12Hour);
      return `${startTime} - ${endTime}`;
    } catch (error) {
      console.error('Error formatting time range:', error);
      return 'Invalid Time Range';
    }
  },

  /**
   * Check if two ISO strings are on the same date
   */
  isSameDate: (iso1: string, iso2: string): boolean => {
    try {
      const date1 = new Date(iso1);
      const date2 = new Date(iso2);
      return date1.toDateString() === date2.toDateString();
    } catch (error) {
      console.error('Error comparing dates:', error);
      return false;
    }
  }
};

export default FormattedDateComponent;
