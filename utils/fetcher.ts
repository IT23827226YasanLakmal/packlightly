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
async function getToken() {
  const user = (await import("firebase/auth")).getAuth().currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
}
