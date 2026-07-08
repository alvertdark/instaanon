import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const parsedUrl = new URL(targetUrl);
    
    // Validación de dominio por seguridad para evitar SSRF abusando del proxy
    const allowedHosts = ['.cdninstagram.com', '.fbcdn.net', '.instagram.com'];
    const isAllowed = allowedHosts.some(host => 
      parsedUrl.hostname === host.slice(1) || parsedUrl.hostname.endsWith(host)
    );

    if (!isAllowed) {
      return new NextResponse('Forbidden domain', { status: 403 });
    }

    // Realizamos fetch al recurso original simulando un cliente web ordinario
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,video/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch asset: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');

    // Construimos las cabeceras de respuesta habilitando caché para Edge y navegador
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }
    
    // Cache de 24 horas (86400 segundos) para no volver a descargar el mismo recurso
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600');

    // Devolvemos el cuerpo de la respuesta como stream directo (clave para videos de historias/reels)
    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error in proxy route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
