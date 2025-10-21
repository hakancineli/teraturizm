import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const filePath = join(process.cwd(), 'public', 'site', 'uploads', path);
    
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = path.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'css':
        contentType = 'text/css';
        break;
      case 'js':
        contentType = 'application/javascript';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }
    
    return new NextResponse(fileBuffer as any, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}