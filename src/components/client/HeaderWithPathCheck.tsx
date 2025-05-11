'use client';
import { usePathname } from "next/navigation";
import HeaderWrapper from "@/components/common/HeaderWrapper";

export default function HeaderWithPathCheck() {
  const pathname = usePathname();
  const isAdminPage = pathname?.includes('/admin');
  
  if (isAdminPage) {
    return null;
  }
  
  return <HeaderWrapper />;
} 