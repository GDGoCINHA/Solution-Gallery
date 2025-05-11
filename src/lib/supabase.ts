import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 관리자 인증 상태 확인 함수
export async function isAdmin() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // 관리자 테이블에서 사용자 확인
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error || !data) return false;
    return true;
  } catch (error) {
    console.error('관리자 인증 확인 중 오류:', error);
    return false;
  }
}

// 관리자 역할 확인 함수
export async function getAdminRole() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // 관리자 테이블에서 사용자 확인
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error || !data) return null;
    return data.role;
  } catch (error) {
    console.error('관리자 역할 확인 중 오류:', error);
    return null;
  }
} 