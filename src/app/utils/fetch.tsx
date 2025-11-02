// src/app/utils/fetch.ts
export async function getLogos() {
  try {
    const res = await fetch("http://127.0.0.1:8000/institution/api/institutions", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
}

export async function getTestimonials() {
  try {
    const res = await fetch("http://127.0.0.1:8000/institution/api/testimonials", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
}
