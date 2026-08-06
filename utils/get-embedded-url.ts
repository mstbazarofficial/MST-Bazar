export function getEmbedUrl(videoUrl: string): string | null {
  if (!videoUrl) return null;

  // Handle YouTube (matches standard, shortened, and already-embed links)
  const ytRegExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  const ytMatch = videoUrl.match(ytRegExp);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Handle Vimeo
  const vimeoRegExp =
    /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
  const vimeoMatch = videoUrl.match(vimeoRegExp);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Fallback if neither matches
  return null;
}
