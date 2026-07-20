'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function BackButton({ href = ROUTES.HOME }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      aria-label="Go back"
      className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}
