'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="px-6 py-8 pb-32 max-w-2xl mx-auto" style={{ animation: 'fadeIn 0.61s ease-out' }}>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1
          className="text-2xl text-white"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Privacy Policy
        </h1>
      </div>

      <p className="text-xs text-slate-400 font-light mb-8">Last updated: February 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg text-white font-light mb-3">What we collect</h2>
          <p className="text-sm text-slate-200 font-light leading-relaxed">
            When you use MisoCalm, we collect only what is needed to provide your experience:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200 font-light list-disc list-inside">
            <li>Your email address (for signing in)</li>
            <li>Trigger logs: sounds, sources, intensity levels, time of day</li>
            <li>Journal entries and check-in data</li>
            <li>Messages exchanged with the AI companion</li>
            <li>Tool usage and preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg text-white font-light mb-3">How we use it</h2>
          <p className="text-sm text-slate-200 font-light leading-relaxed">
            Your data is used to:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200 font-light list-disc list-inside">
            <li>Provide the core app experience, including your personal dashboard and insights</li>
            <li>Show you patterns and reflections about your triggers over time</li>
            <li>Improve how MisoCalm works for everyone (aggregated and anonymised)</li>
          </ul>
          <p className="mt-3 text-sm text-slate-200 font-light leading-relaxed">
            We never sell your data or use it for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-white font-light mb-3">Where it is stored</h2>
          <p className="text-sm text-slate-200 font-light leading-relaxed">
            Your data is stored securely using Supabase, a hosted database platform. All data is encrypted
            both in transit (via HTTPS) and at rest. Our infrastructure is designed to keep your
            personal information safe.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-white font-light mb-3">Third-party services</h2>
          <p className="text-sm text-slate-200 font-light leading-relaxed">
            MisoCalm uses a small number of trusted services. Each only receives the minimum data
            needed to function:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200 font-light list-disc list-inside">
            <li><span className="text-white">Supabase</span> - Database and authentication</li>
            <li><span className="text-white">Anthropic</span> - AI companion chat (your messages are sent to generate responses)</li>
            <li><span className="text-white">Stripe</span> - Payment processing for subscriptions (we never see your full card details)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg text-white font-light mb-3">Your rights</h2>
          <p className="text-sm text-slate-200 font-light leading-relaxed">
            You are in control of your data. You can:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200 font-light list-disc list-inside">
            <li>Export your data at any time from your profile</li>
            <li>Request complete deletion of your account and all associated data</li>
            <li>Contact us at any time to ask what data we hold about you</li>
          </ul>
          <p className="mt-3 text-sm text-slate-200 font-light leading-relaxed">
            To request data deletion, reach out to{' '}
            <a href="mailto:support@misocalm.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              support@misocalm.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg text-white font-light mb-3">Children's privacy</h2>
          <p className="text-sm text-slate-200 font-light leading-relaxed">
            MisoCalm is not intended for children under 13. We do not knowingly collect personal
            information from children. If you believe a child has provided us with their data,
            please contact us and we will remove it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-white font-light mb-3">Changes to this policy</h2>
          <p className="text-sm text-slate-200 font-light leading-relaxed">
            We may update this privacy policy from time to time. If we make significant changes,
            we will notify you through the app or by email. Your continued use of MisoCalm after
            changes take effect means you accept the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-white font-light mb-3">Contact</h2>
          <p className="text-sm text-slate-200 font-light leading-relaxed">
            If you have any questions about this policy or your data, please reach out to us at{' '}
            <a href="mailto:support@misocalm.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              support@misocalm.com
            </a>
          </p>
        </section>

        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Last reviewed February 2026. If you have questions, reach out at the email above.
          </p>
        </div>
      </div>
    </div>
  );
}
