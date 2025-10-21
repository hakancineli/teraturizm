import { redirect } from 'next/navigation';

export default function SitePage() {
  // Redirect to the main page to avoid duplicate loading
  redirect("/");
}