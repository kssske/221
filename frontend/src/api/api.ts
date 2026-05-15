const baseUrl = import.meta.env.VITE_API_URL;
//RequestInit: This is the name of the "type" that contains 
// all the necessary settings
//  for fetching, such as method (GET or POST), body (data to send), and headers (additional information).
export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {

    const token = localStorage.getItem("token");

    const headers: Record<string, string> = { //fix as string, string
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>)  //... means disassembly the contents 
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(baseUrl + url, {
        ...options,
        headers
    });

    const data = await res.json();

    if (!res.ok) {
        const message = data.errors || data.error || "API error";
        throw new Error(Array.isArray(message) ? message.join(", ") : message);
    }

    return data as T;
}