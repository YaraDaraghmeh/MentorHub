import urlAuth from "../Utilities/Auth/urlAuth";

export interface GoogleAuthResponse {
  userId: string;
  roles: "Admin" | "Mentor" | "Mentee" | string[];
  email: string;
  accessToken: string;
  refreshToken: string;
}

class GoogleAuthService {
  /**
   * Initiates Google Sign-In by redirecting to the backend Google OAuth endpoint
   * @param returnUrl - Optional return URL after successful authentication
   */
  static initiateGoogleSignIn(returnUrl: string = "/"): void {
    try {
      // Get current origin for return URL
      const currentOrigin = window.location.origin;
      
      // Create the callback URL that matches your Google OAuth configuration
      const callbackUrl = `${currentOrigin}/auth/google/callback`;
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      
      // Store the intended return URL in sessionStorage for later use
      sessionStorage.setItem('googleAuthReturnUrl', returnUrl);
      
      // Construct the Google OAuth URL with proper callback
      const googleAuthUrl = `${urlAuth.GOOGLE_LOGIN}?returnUrl=${encodedCallbackUrl}`;
      
      console.log("Initiating Google Sign-In:", googleAuthUrl);
      console.log("Callback URL:", callbackUrl);
      
      // Redirect to Google OAuth
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error("Error initiating Google Sign-In:", error);
      throw new Error("Failed to initiate Google Sign-In");
    }
  }

  /**
   * Handles the callback from Google OAuth (if needed for SPA handling)
   * This method can be used if you need to handle the response in a popup or iframe
   */
  static handleGoogleCallback(): Promise<GoogleAuthResponse> {
    return new Promise((resolve, reject) => {
      // Check URL parameters for authentication data
      const urlParams = new URLSearchParams(window.location.search);
      
      // If your backend returns auth data as URL parameters
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');
      const userId = urlParams.get('userId');
      const email = urlParams.get('email');
      const roles = urlParams.get('roles');

      if (accessToken && refreshToken && userId && email && roles) {
        const authData: GoogleAuthResponse = {
          accessToken,
          refreshToken,
          userId,
          email,
          roles: roles as "Admin" | "Mentor" | "Mentee"
        };
        
        resolve(authData);
      } else {
        reject(new Error("Authentication data not found in URL parameters"));
      }
    });
  }

  /**
   * Alternative method for popup-based Google Sign-In
   * This opens Google OAuth in a popup window
   */
  static initiateGoogleSignInPopup(): Promise<GoogleAuthResponse> {
    return new Promise((resolve, reject) => {
      try {
        const currentOrigin = window.location.origin;
        const encodedReturnUrl = encodeURIComponent(`${currentOrigin}/auth/google/callback`);
        const googleAuthUrl = `${urlAuth.GOOGLE_LOGIN}?returnUrl=${encodedReturnUrl}`;
        
        // Open popup window
        const popup = window.open(
          googleAuthUrl,
          'googleSignIn',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        if (!popup) {
          reject(new Error("Popup blocked. Please allow popups for this site."));
          return;
        }

        // Listen for popup to close or send message
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error("Google Sign-In was cancelled"));
          }
        }, 1000);

        // Listen for messages from popup
        const messageListener = (event: MessageEvent) => {
          if (event.origin !== currentOrigin) return;
          
          if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();
            resolve(event.data.authData);
          } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();
            reject(new Error(event.data.error || "Google Sign-In failed"));
          }
        };

        window.addEventListener('message', messageListener);

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          if (!popup.closed) {
            popup.close();
          }
          reject(new Error("Google Sign-In timeout"));
        }, 300000);

      } catch (error) {
        console.error("Error in popup Google Sign-In:", error);
        reject(error);
      }
    });
  }

  /**
   * Utility method to check if current URL contains Google auth callback data
   */
  static isGoogleAuthCallback(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code') || urlParams.has('accessToken');
  }

  /**
   * Clean up URL parameters after successful authentication
   */
  static cleanupAuthParams(): void {
    const url = new URL(window.location.href);
    const paramsToRemove = ['code', 'state', 'accessToken', 'refreshToken', 'userId', 'email', 'roles'];
    
    paramsToRemove.forEach(param => {
      url.searchParams.delete(param);
    });
    
    window.history.replaceState({}, document.title, url.toString());
  }
}

export default GoogleAuthService;
