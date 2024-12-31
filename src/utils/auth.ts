const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // Default to localhost if env is missing
console.log('Backend URL:', backendUrl);

// Lock mechanism to prevent multiple token refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeToTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onAccessTokenRefreshed = (newAccessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

export const register = async (userDetails: {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}) => {
  try {
    const response = await fetch(`${backendUrl}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      document.cookie = 'isLoggedIn=true; path=/; max-age=86400'; // Set cookie for 24 hours
      console.log('User registered successfully:', data);
      return true;
    } else {
      console.error('Registration failed:', data.error || response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return false;
  }
};

export const login = async (credentials: { username: string; password: string }) => {
  try {
    const response = await fetch(`${backendUrl}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      document.cookie = 'isLoggedIn=true; path=/; max-age=86400'; // Set cookie for 24 hours
      // console.log('Refresh Token after login:', localStorage.getItem('refresh_token'));
      return true;
    } else {
      console.error('Login failed:', data.error || response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error during login:', error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const fetchData = async (url: string, options = {}) => {
  const token = localStorage.getItem('access_token');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(options as any).headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      console.warn('Access token expired. Refreshing...');

      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request with the new token
        const newToken = localStorage.getItem('access_token');
        return fetchData(url, {
          ...options,
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        });
      } else {
        throw new Error('Authentication failed. Unable to refresh token.');
      }
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    console.error('No refresh token available');
    return false;
  }

  if (isRefreshing) {
    // Wait for the current refresh to complete
    return new Promise<boolean>((resolve) => {
      subscribeToTokenRefresh((newAccessToken) => {
        resolve(!!newAccessToken); // Resolve with true if a token was refreshed
      });
    });
  }

  isRefreshing = true;

  try {
    // console.log('Refreshing token with payload:', { refresh: refreshToken });

    const response = await fetch(`${backendUrl}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to refresh token:', errorData);
      isRefreshing = false;
      return false;
    }

    const data = await response.json();

    if (data.access) {
      // console.log('Access token refreshed successfully:', data.access);
      localStorage.setItem('access_token', data.access);

      // Update refresh token if provided in response
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }

      isRefreshing = false;
      onAccessTokenRefreshed(data.access); // Notify all subscribers
      return true;
    } else {
      console.error('Failed to refresh token: Access token not returned in response');
      isRefreshing = false;
      return false;
    }
  } catch (error) {
    console.error('Error during token refresh:', error);
    isRefreshing = false;
    return false;
  }
};
