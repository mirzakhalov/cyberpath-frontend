'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative">
        <SignUp
          forceRedirectUrl={redirectUrl}
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-white shadow-2xl',
              headerTitle: 'text-slate-900',
              headerSubtitle: 'text-slate-600',
              socialButtonsBlockButton: 'border-slate-200 hover:bg-slate-50',
              formFieldLabel: 'text-slate-700',
              formFieldInput: 'border-slate-200 focus:border-primary focus:ring-primary',
              footerActionLink: 'text-primary hover:text-primary/80',
            },
          }}
        />
      </div>
    </div>
  );
}


