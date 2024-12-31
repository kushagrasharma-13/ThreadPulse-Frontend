export const register = async (userDetails: { username: string; email: string; password: string; confirm_password: string }) => {
  try {
    const response = await fetch('http://localhost:8000/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh); // Ensure this is correct
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
    const response = await fetch('http://localhost:8000/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh); // Ensure this is correct
      document.cookie = 'isLoggedIn=true; path=/; max-age=86400'; // Set cookie for 24 hours
      console.log('Refresh Token after login:', localStorage.getItem('refresh_token'));
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

export const fetchData = async (url: string) => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return fetchData(url);
      } else {
        throw new Error('Authentication failed');
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

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    console.error('No refresh token available');
    return false;
  }

  try {
    console.log('Refreshing token with payload:', { refresh: refreshToken });
    
    const response = await fetch('http://localhost:8000/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      // Log detailed error information
      const errorData = await response.json();
      console.error('Failed to refresh token:', errorData);
      return false;
    }

    const data = await response.json();

    if (data.access) {
      console.log('Access token refreshed successfully');
      localStorage.setItem('access_token', data.access);

      // Optional: Update the refresh token if provided in the response
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }

      return true;
    } else {
      console.error('Failed to refresh token: Access token not returned in response');
      return false;
    }
  } catch (error) {
    console.error('Error during token refresh:', error);
    return false;
  }
};
