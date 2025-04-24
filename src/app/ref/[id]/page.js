// app/ref/[id]/page.js
import { redirect } from 'next/navigation';

export default function RedirectPage({ params }) {
  const userId = params.id;

  // Redirige con query param
  redirect(`https://www.webomo.ch/de/webomo-business?ref=${userId}`);
}
