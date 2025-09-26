import urlAuth from '../Utilities/Auth/urlAuth';

export interface GoogleAuthResponse {
  userId: string;
  roles: "Admin" | "Mentor" | "Mentee" | string[];
  email: string;
  accessToken: string;
  refreshToken: string;
}

class GoogleAuthService {
  /** إطلاق Google OAuth */
  static initiateGoogleSignIn(): void {
    const currentOrigin = window.location.origin;
    const callbackUrl = `${currentOrigin}/auth/google/callback`;
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    const googleAuthUrl = `${urlAuth.GOOGLE_LOGIN}?returnUrl=${encodedCallbackUrl}`;
    window.location.href = googleAuthUrl;
  }

  /** قراءة البيانات بعد المصادقة */
  static async handleGoogleCallback(): Promise<GoogleAuthResponse> {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    const userId = urlParams.get("userId");
    const email = urlParams.get("email");
    const roles = urlParams.get("roles");

    if (!accessToken || !refreshToken || !userId || !email || !roles) {
      throw new Error("Authentication data not found in URL");
    }

    return {
      accessToken,
      refreshToken,
      userId,
      email,
      roles: roles as "Admin" | "Mentor" | "Mentee",
    };
  }

  /** تنظيف الـ URL بعد المصادقة */
  static cleanupAuthParams(): void {
    const url = new URL(window.location.href);
    ["accessToken", "refreshToken", "userId", "email", "roles"].forEach((p) =>
      url.searchParams.delete(p)
    );
    window.history.replaceState({}, document.title, url.toString());
  }

  /** للتحقق من أننا في صفحة callback */
  static isGoogleAuthCallback(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has("accessToken");
  }
}

export default GoogleAuthService;