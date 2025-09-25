import axios from 'axios';
import urlAuth from '../Utilities/Auth/urlAuth';

class PasswordResetService {
  /**
   * Initiates the password reset process by sending an email with a verification code
   * @param email - User's email address
   */
  static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${urlAuth.LOGIN_USER.replace('/login', '/forgot-password')}`,
        { email }
      );
      return {
        success: true,
        message: response.data.message || 'Verification code sent to your email.'
      };
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send verification code. Please try again.'
      };
    }
  }

  /**
   * Verifies the reset code and allows setting a new password
   * @param email - User's email address
   * @param code - Verification code received via email
   * @param newPassword - New password to set
   */
  static async resetPassword(
    email: string, 
    code: string, 
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${urlAuth.LOGIN_USER.replace('/login', '/reset-password')}`,
        { email, code, newPassword }
      );
      return {
        success: true,
        message: response.data.message || 'Password has been reset successfully.'
      };
    } catch (error: any) {
      console.error('Password reset failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password. Please try again.'
      };
    }
  }
}

export default PasswordResetService;
