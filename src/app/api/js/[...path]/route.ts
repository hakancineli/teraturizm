import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const filePath = join(process.cwd(), 'public', 'site', 'js', path);
    
    const fileBuffer = await readFile(filePath);
    
    return new NextResponse(fileBuffer as any, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}