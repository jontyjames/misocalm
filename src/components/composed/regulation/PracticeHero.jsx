import { PHI_SCALE } from '@/lib/constants';

export default function PracticeHero({ practice }) {
  return (
    <div style={{ marginBottom: PHI_SCALE[3] }}>
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300/80">
        {practice.module} / {practice.family}
      </p>
      <h1
        className="text-2xl text-white"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
      >
        {practice.title}
      </h1>
      <p className="mt-2 text-sm font-light leading-relaxed text-slate-300">
        {practice.summary}
      </p>
    </div>
  );
}
