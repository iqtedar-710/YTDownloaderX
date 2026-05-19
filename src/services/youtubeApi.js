const BASE_URL = "http://127.0.0.1:8000";

export const fetchVideoInfo = async (url) => {

  const response = await fetch(
    `${BASE_URL}/info?url=${encodeURIComponent(url)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return await response.json();
};

export const downloadVideo = (url, formatId) => {

  window.open(
    `${BASE_URL}/download?url=${encodeURIComponent(url)}&format_id=${formatId}`,
    "_blank"
  );
};

export const downloadAudio = (url, quality) => {

  window.open(
    `${BASE_URL}/audio?url=${encodeURIComponent(url)}&quality=${quality}`,
    "_blank"
  );
};

export const downloadThumbnail = (url) => {

  window.open(
    `${BASE_URL}/thumbnail?url=${encodeURIComponent(url)}`,
    "_blank"
  );
};