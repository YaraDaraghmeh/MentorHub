# Google OAuth Setup Guide for MentorHub

## Problem
You're encountering a `redirect_uri_mismatch` error when trying to sign in with Google. This happens when the redirect URI configured in Google Cloud Console doesn't match the one being sent in the OAuth request.

## Solution Steps

### 1. Configure Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project (or create one if needed)

2. **Navigate to Credentials**
   - Go to **APIs & Services** > **Credentials**
   - Find your OAuth 2.0 Client ID for "Mentor-Hub"

3. **Add Authorized Redirect URIs**
   
   **For Production Environment:**
   ```
   https://mentor-hub.runasp.net/api/auth/login/google/callback
   https://mentor-hub.runasp.net/auth/google/callback
   ```
   
   **For Development Environment:**
   ```
   http://localhost:5173/auth/google/callback
   http://localhost:3000/auth/google/callback
   https://localhost:5173/auth/google/callback
   http://127.0.0.1:5173/auth/google/callback
   ```

4. **Save the Configuration**
   - Click **Save** after adding all redirect URIs

### 2. Backend Configuration (ASP.NET Core)

Make sure your backend Google OAuth configuration matches these settings:

```csharp
// In your Startup.cs or Program.cs
services.AddAuthentication()
    .AddGoogle(options =>
    {
        options.ClientId = "your-google-client-id";
        options.ClientSecret = "your-google-client-secret";
        options.CallbackPath = "/api/auth/login/google/callback";
    });
```

### 3. Frontend Configuration

The frontend is now configured to:
- Use the correct callback URL: `/auth/google/callback`
- Store the intended return URL in sessionStorage
- Handle the OAuth flow properly

### 4. Testing the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the login page:**
   ```
   http://localhost:5173/login
   ```

3. **Click "Sign in with Google"**
   - Should redirect to Google OAuth
   - After authentication, should redirect back to your app
   - Should automatically log you in and redirect to the appropriate dashboard

### 5. Troubleshooting

**If you still get redirect_uri_mismatch:**
1. Check that the redirect URI in Google Console exactly matches what's being sent
2. Make sure there are no trailing slashes or extra parameters
3. Verify the protocol (http vs https) matches your environment
4. Check browser developer tools for the exact URL being requested

**Common Issues:**
- **Protocol mismatch**: Make sure http/https matches between frontend and Google Console
- **Port mismatch**: Ensure the port number is correct (usually 5173 for Vite)
- **Path mismatch**: The callback path must exactly match what's configured

### 6. Environment Variables

Consider using environment variables for different environments:

```typescript
// In your urlAuth.tsx
const API_URL_DEVELOPMENT = import.meta.env.VITE_API_URL_DEV || "/api/auth";
const API_URL_PRODUCTION = import.meta.env.VITE_API_URL_PROD || "https://mentor-hub.runasp.net/api/auth";
```

### 7. Security Considerations

- Never expose your Google Client Secret in frontend code
- Use HTTPS in production
- Validate the state parameter to prevent CSRF attacks
- Implement proper error handling for failed authentications

## Current Implementation Features

✅ **Redirect URI Management**: Proper callback URL construction
✅ **Return URL Handling**: Stores intended destination and redirects after auth
✅ **Error Handling**: Comprehensive error messages and fallbacks
✅ **Role-based Routing**: Automatic redirection based on user role
✅ **Loading States**: Visual feedback during authentication process
✅ **URL Cleanup**: Removes auth parameters after successful login

## Next Steps

1. Configure Google Cloud Console with the correct redirect URIs
2. Test the authentication flow
3. Verify that users are properly redirected after authentication
4. Monitor for any additional OAuth-related errors
