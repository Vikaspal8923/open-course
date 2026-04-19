export function getYouTubeEmbedUrl(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes('youtube.com') && parsedUrl.pathname.startsWith('/embed/')) {
      return parsedUrl.toString();
    }

    let videoId = '';

    if (parsedUrl.hostname === 'youtu.be') {
      videoId = parsedUrl.pathname.replace('/', '');
    } else if (parsedUrl.hostname.includes('youtube.com')) {
      if (parsedUrl.pathname === '/watch') {
        videoId = parsedUrl.searchParams.get('v') || '';
      } else if (parsedUrl.pathname.startsWith('/shorts/')) {
        videoId = parsedUrl.pathname.split('/')[2] || '';
      } else if (parsedUrl.pathname.startsWith('/live/')) {
        videoId = parsedUrl.pathname.split('/')[2] || '';
      }
    }

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}
