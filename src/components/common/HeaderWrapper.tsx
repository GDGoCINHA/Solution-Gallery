'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/common/Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isAdminPage = pathname?.includes('/admin');
  
  if (isAdminPage) {
    return null;
  }
  
  return <Header />;
} 