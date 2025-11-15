// Custom fetcher with token and config
export async function fetcherWithTokenConfig(url: string, options: RequestInit = {}) {
  const token = await getToken();
  
  // Check if body is FormData - if so, don't set Content-Type (let browser set it with boundary)
  const isFormData = options.body instanceof FormData;
  
  const headers: HeadersInit = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };
  
  // Only set Content-Type for non-FormData requests
  if (!isFormData) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  
  const res = await fetch(url, {
    ...options,
    headers,
  });
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
}
// utils/fetcher.ts
export async function fetcherWithToken(url: string) {

  const token = await getToken(); 
  
  if (!token) {

  }
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  // Only add Authorization header if token exists
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    headers,
  });
  

  
  if (!res.ok) {

    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }

  // Check if the response is a file download based on content-type
  const contentType = res.headers.get('content-type');

  
  if (contentType && !contentType.includes('application/json')) {
    // Return blob for file downloads (PDF, CSV, XLSX, etc.)

    return res.blob();
  }
  
  // Return JSON for normal API responses

  return res.json();
}

// Example: if using Firebase
export async function getToken() {

  try {
    const { auth } = await import("@/lib/firebaseClient");
    const user = auth.currentUser;
    

    
    if (user) {

      const token = await user.getIdToken(true); // Force refresh token


      return token;
    }

    return null;
  } catch (error) {

    return null;
  }
}
