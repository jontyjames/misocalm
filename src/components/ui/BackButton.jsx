'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ href }) {
  const router = useRouter();
  return (
    <button
      onClick={() => href ? router.push(href) : router.back()}
      className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}
