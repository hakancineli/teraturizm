'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siteContent, setSiteContent] = useState<string | null>(null);

  useEffect(() => {
    // Load the site content
    const loadSite = async () => {
      try {
        console.log("Starting to load site...");
        
        const response = await fetch('/index.html');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let htmlContent = await response.text();
        console.log("HTML content loaded, length:", htmlContent.length);
        
        // Fix relative paths to work with Next.js public folder
        htmlContent = htmlContent
          // Fix CSS, JS, assets paths
          .replace(/href="css\//g, 'href="/css/')
          .replace(/src="js\//g, 'src="/js/')
          .replace(/src="assets\//g, 'src="/assets/')
          .replace(/href="assets\//g, 'href="/assets/')
          .replace(/href="fonts\//g, 'href="/fonts/')
          .replace(/src="fonts\//g, 'src="/fonts/')
          
          // Fix uploads and images paths
          .replace(/src="uploads\//g, 'src="/uploads/')
          .replace(/src="images\//g, 'src="/images/')
          .replace(/href="uploads\//g, 'href="/uploads/')
          .replace(/href="images\//g, 'href="/images/')
          
          // Fix data-src attributes
          .replace(/data-src="uploads\//g, 'data-src="/uploads/')
          .replace(/data-src="images\//g, 'data-src="/images/')
          .replace(/data-src="https:\/\/www\.teraturizm\.com\//g, 'data-src="/')
          
          // Fix src with full URLs
          .replace(/src="https:\/\/www\.teraturizm\.com\//g, 'src="/')
          .replace(/href="https:\/\/www\.teraturizm\.com\//g, 'href="/')
          
          // Fix CSS url() functions
          .replace(/url\("fonts\//g, 'url("/fonts/')
          .replace(/url\('fonts\//g, "url('/fonts/")
          .replace(/url\(fonts\//g, 'url(/fonts/')
          .replace(/url\("uploads\//g, 'url("/uploads/')
          .replace(/url\('uploads\//g, "url('/uploads/")
          .replace(/url\(uploads\//g, 'url(/uploads/')
          .replace(/url\("images\//g, 'url("/images/')
          .replace(/url\('images\//g, "url('/images/")
          .replace(/url\(images\//g, 'url(/images/')
          
          // Fix navigation links
          .replace(/href="index\.html"/g, 'href="/')
          .replace(/href="en\/index\.html"/g, 'href="/en/index.html')
          .replace(/href="categories-/g, 'href="/categories-')
          .replace(/href="product-/g, 'href="/product-')
          .replace(/href="blog\//g, 'href="/blog/')
          .replace(/href="cmscorporate-/g, 'href="/cmscorporate-')
          
          // Fix form actions
          .replace(/action="https:\/\/www\.teraturizm\.com\//g, 'action="/')
          
          // Fix any remaining relative paths
          .replace(/="(css\/|js\/|assets\/|uploads\/|images\/|fonts\/)/g, '="/$1')
          
          // Fix inline style background-image URLs with HTML entities
          .replace(/background-image:\s*url\("([^&]+)"\)/g, function(match, url) {
            if (url.startsWith('uploads/') || url.startsWith('images/') || url.startsWith('assets/')) {
              return 'background-image: url("/' + url + '")';
            }
            return match;
          })
          
          // Fix inline style background-image URLs
          .replace(/style="[^"]*background-image:\s*url\(([^)]+)\)[^"]*"/g, function(match, url) {
            if (url.startsWith('uploads/') || url.startsWith('images/') || url.startsWith('assets/')) {
              return match.replace(url, '/' + url);
            }
            return match;
          })
          
          // Fix style attribute with various URL patterns
          .replace(/background-image:\s*url\(([^)]+)\)/g, function(match, url) {
            if (url.startsWith('uploads/') || url.startsWith('images/') || url.startsWith('assets/')) {
              return 'background-image: url(/' + url + ')';
            }
            return match;
          })
          
          // Fix data-background-image attributes
          .replace(/data-background-image="([^"]+)"/g, function(match, url) {
            if (url.startsWith('uploads/') || url.startsWith('images/') || url.startsWith('assets/')) {
              return 'data-background-image="/' + url + '"';
            }
            return match;
          })
          
          // Fix all remaining uploads/ paths in HTML attributes
          .replace(/="(uploads\/[^"]+)"/g, '="/$1')
          .replace(/="(images\/[^"]+)"/g, '="/$1')
          .replace(/="(assets\/[^"]+)"/g, '="/$1');
        
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // Add base tag to head if not exists
        const headContent = tempDiv.querySelector('head');
        if (headContent && !headContent.querySelector('base')) {
          const baseTag = document.createElement('base');
          baseTag.href = '/';
          headContent.insertBefore(baseTag, headContent.firstChild);
        }
        
        // Get the complete HTML with base tag
        const modifiedHtml = tempDiv.innerHTML;
        console.log("HTML content modified with base tag and fixed paths");
        
        setSiteContent(modifiedHtml);
        setLoading(false);
      } catch (error) {
        console.error('Error loading site:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setLoading(false);
      }
    };
    
    // Use a timeout to ensure the page is fully loaded before starting
    const timer = setTimeout(() => {
      loadSite();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Site yükleniyor...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>
          <p>Hata oluştu: {error}</p>
          <button onClick={() => window.location.reload()}>Yeniden Dene</button>
        </div>
      </div>
    );
  }
  
  if (siteContent) {
    return (
      <div dangerouslySetInnerHTML={{ __html: siteContent }} />
    );
  }
  
  return (
    <div>
      <p>Site yükleniyor...</p>
    </div>
  );
}
