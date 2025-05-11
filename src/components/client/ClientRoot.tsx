'use client';

import { ErrorBoundary } from 'react-error-boundary';
import Error from '@/app/error';
import Loading from '@/app/Loading';
import HeaderWithPathCheck from '@/components/client/HeaderWithPathCheck';
import { Suspense } from 'react';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={(({
      error,
      resetErrorBoundary,
    }: {
      error: Error;
      resetErrorBoundary: () => void;
    }) => <Error error={error} reset={resetErrorBoundary} />) as unknown as React.ReactNode}>
      <HeaderWithPathCheck />
      <main className="pt-0">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>
    </ErrorBoundary>
  );
} 