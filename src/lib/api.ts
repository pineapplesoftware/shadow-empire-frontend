export const API_URL = "http://localhost:3000"; // Cambia esto si tu backend está en otro lugar

export const generateVideo = async (prompt: string) => {
  const res = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error("Error al generar el video");
  return await res.json();
};

export const getVideos = async () => {
  const res = await fetch(`${API_URL}/api/videos`);
  if (!res.ok) throw new Error("Error al cargar videos");
  return await res.json();
};
