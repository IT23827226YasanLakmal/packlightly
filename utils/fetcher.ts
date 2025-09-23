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
  const token = await getToken(); // <- implement this
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // attach token
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
}

// Example: if using Firebase
export async function getToken() {
  const user = (await import("firebase/auth")).getAuth().currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
}
