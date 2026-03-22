export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {

    const token = localStorage.getItem("token");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>)
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        ...options,
        headers
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "API error");
    }

    return data as T;
}