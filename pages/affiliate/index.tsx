import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AffiliateIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/affiliate/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-900 flex items-center justify-center">
      <div className="text-white">Redirecionando para affiliate dashboard...</div>
    </div>
  );
}
