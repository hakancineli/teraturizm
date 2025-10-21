import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch the content from the original site
    const response = await fetch('https://www.teraturizm.com/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const htmlContent = await response.text();
    
    // Fix relative paths to work with our proxy
    const modifiedHtml = htmlContent
      // Fix CSS, JS, assets paths
      .replace(/href="css\//g, 'href="/api/proxy/teraturizm/css/')
      .replace(/src="js\//g, 'src="/api/proxy/teraturizm/js/')
      .replace(/src="assets\//g, 'src="/api/proxy/teraturizm/assets/')
      .replace(/href="assets\//g, 'href="/api/proxy/teraturizm/assets/')
      .replace(/href="fonts\//g, 'href="/api/proxy/teraturizm/fonts/')
      .replace(/src="fonts\//g, 'src="/api/proxy/teraturizm/fonts/')
      
      // Fix uploads and images paths
      .replace(/src="uploads\//g, 'src="/api/proxy/teraturizm/uploads/')
      .replace(/src="images\//g, 'src="/api/proxy/teraturizm/images/')
      .replace(/href="uploads\//g, 'href="/api/proxy/teraturizm/uploads/')
      .replace(/href="images\//g, 'href="/api/proxy/teraturizm/images/')
      
      // Fix data-src attributes
      .replace(/data-src="uploads\//g, 'data-src="/api/proxy/teraturizm/uploads/')
      .replace(/data-src="images\//g, 'data-src="/api/proxy/teraturizm/images/')
      .replace(/data-src="https:\/\/www\.teraturizm\.com\//g, 'data-src="/api/proxy/teraturizm/')
      
      // Fix src with full URLs
      .replace(/src="https:\/\/www\.teraturizm\.com\//g, 'src="/api/proxy/teraturizm/')
      .replace(/href="https:\/\/www\.teraturizm\.com\//g, 'href="/api/proxy/teraturizm/')
      
      // Fix CSS url() functions
      .replace(/url\("fonts\//g, 'url("/api/proxy/teraturizm/fonts/')
      .replace(/url\('fonts\//g, "url('/api/proxy/teraturizm/fonts/")
      .replace(/url\(fonts\//g, 'url(/api/proxy/teraturizm/fonts/')
      .replace(/url\("uploads\//g, 'url("/api/proxy/teraturizm/uploads/')
      .replace(/url\('uploads\//g, "url('/api/proxy/teraturizm/uploads/")
      .replace(/url\(uploads\//g, 'url(/api/proxy/teraturizm/uploads/')
      .replace(/url\("images\//g, 'url("/api/proxy/teraturizm/images/')
      .replace(/url\('images\//g, "url('/api/proxy/teraturizm/images/")
      .replace(/url\(images\//g, 'url(/api/proxy/teraturizm/images/')
      
      // Fix navigation links
      .replace(/href="index\.html"/g, 'href="/')
      .replace(/href="en\/index\.html"/g, 'href="/api/proxy/teraturizm/en/index.html')
      .replace(/href="categories-/g, 'href="/api/proxy/teraturizm/categories-')
      .replace(/href="product-/g, 'href="/api/proxy/teraturizm/product-')
      .replace(/href="blog\//g, 'href="/api/proxy/teraturizm/blog/')
      .replace(/href="cmscorporate-/g, 'href="/api/proxy/teraturizm/cmscorporate-')
      
      // Fix form actions
      .replace(/action="https:\/\/www\.teraturizm\.com\//g, 'action="/api/proxy/teraturizm/')
      
      // Fix any remaining relative paths
      .replace(/="(css\/|js\/|assets\/|uploads\/|images\/|fonts\/)/g, '="/api/proxy/teraturizm/$1')
      
      // Fix inline style background-image URLs with HTML entities
      .replace(/background-image:\s*url\("([^&]+)"\)/g, function(match, url) {
        if (url.startsWith('uploads/') || url.startsWith('images/') || url.startsWith('assets/')) {
          return 'background-image: url("/api/proxy/teraturizm/' + url + '")';
        }
        return match;
      })
      
      // Fix inline style background-image URLs
      .replace(/style="[^"]*background-image:\s*url\(([^)]+)\)[^"]*"/g, function(match, url) {
        if (url.startsWith('uploads/') || url.startsWith('images/') || url.startsWith('assets/')) {
          return match.replace(url, '/api/proxy/teraturizm/' + url);
        }
        return match;
      })
      
      // Fix style attribute with various URL patterns
      .replace(/background-image:\s*url\(([^)]+)\)/g, function(match, url) {
        if (url.startsWith('uploads/') || url.startsWith('images/') || url.startsWith('assets/')) {
          return 'background-image: url(/api/proxy/teraturizm/' + url + ')';
        }
        return match;
      })
      
      // Fix data-background-image attributes
      .replace(/data-background-image="([^"]+)"/g, function(match, url) {
        if (url.startsWith('uploads/') || url.startsWith('images/') || url.startsWith('assets/')) {
          return 'data-background-image="/api/proxy/teraturizm/' + url + '"';
        }
        return match;
      })
      
      // Fix all remaining uploads/ paths in HTML attributes
      .replace(/="(uploads\/[^"]+)"/g, '="/api/proxy/teraturizm/$1')
      .replace(/="(images\/[^"]+)"/g, '="/api/proxy/teraturizm/$1')
      .replace(/="(assets\/[^"]+)"/g, '="/api/proxy/teraturizm/$1');
    
    return new NextResponse(modifiedHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return new NextResponse('Error fetching content', { status: 500 });
  }
}