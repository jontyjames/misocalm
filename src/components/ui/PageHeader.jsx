/**
 * PageHeader — back button + page title
 * Composes BackButton with a Josefin Sans 200 heading
 */

'use client';

import BackButton from './BackButton';

export default function PageHeader({ title, backHref, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BackButton href={backHref} />
      <h1
        className="text-2xl text-white"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
      >
        {title}
      </h1>
    </div>
  );
}
