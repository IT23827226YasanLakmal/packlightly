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
  console.log('🌐 Making API call to:', url);
  const token = await getToken(); 
  
  if (!token) {
    console.log('⚠️ No token available, making request without authentication');
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
  
  console.log('📡 API response status:', res.status);
  
  if (!res.ok) {
    console.error('❌ API request failed with status:', res.status);
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }

  // Check if the response is a file download based on content-type
  const contentType = res.headers.get('content-type');
  console.log('📄 Response content-type:', contentType);
  
  if (contentType && !contentType.includes('application/json')) {
    // Return blob for file downloads (PDF, CSV, XLSX, etc.)
    console.log('📦 Returning response as blob');
    return res.blob();
  }
  
  // Return JSON for normal API responses
  console.log('📋 Returning response as JSON');
  return res.json();
}

// Example: if using Firebase
export async function getToken() {
  console.log('🔐 Getting authentication token...');
  try {
    const { auth } = await import("@/lib/firebaseClient");
    const user = auth.currentUser;
    
    console.log('👤 Current user:', user ? `${user.uid} (${user.email})` : 'null');
    
    if (user) {
      console.log('🔄 Requesting fresh ID token...');
      const token = await user.getIdToken(true); // Force refresh token
      console.log('✅ Token obtained for user:', user.uid);
      console.log('🔍 Token preview:', token ? `${token.substring(0, 50)}...` : 'null');
      return token;
    }
    console.log('⚠️ No authenticated user found');
    return null;
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
}
