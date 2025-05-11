'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/display/Card';

type DashboardStats = {
  teams: number;
  projects: number;
  members: number;
  votes: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    teams: 0,
    projects: 0,
    members: 0,
    votes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string>('');

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // 현재 로그인한 사용자 정보
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setAdminEmail(user.email);
        }

        // 팀 수 조회
        const { count: teamCount } = await supabase
          .from('teams')
          .select('*', { count: 'exact', head: true });

        // 프로젝트 수 조회
        const { count: projectCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        // 멤버 수 조회
        const { count: memberCount } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true });

        // 투표 수 조회
        const { count: voteCount } = await supabase
          .from('project_votes')
          .select('*', { count: 'exact', head: true });

        setStats({
          teams: teamCount || 0,
          projects: projectCount || 0,
          members: memberCount || 0,
          votes: voteCount || 0,
        });
      } catch (error) {
        console.error('통계 로드 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">관리자 대시보드</h1>
        <p className="text-muted-foreground">
          {adminEmail ? `${adminEmail}님 환영합니다.` : '환영합니다!'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">팀</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <span className="animate-pulse">...</span> : stats.teams}
            </div>
            <p className="text-xs text-muted-foreground">
              등록된 팀 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">프로젝트</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <span className="animate-pulse">...</span> : stats.projects}
            </div>
            <p className="text-xs text-muted-foreground">
              등록된 프로젝트 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">멤버</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <span className="animate-pulse">...</span> : stats.members}
            </div>
            <p className="text-xs text-muted-foreground">
              등록된 멤버 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">투표</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <span className="animate-pulse">...</span> : stats.votes}
            </div>
            <p className="text-xs text-muted-foreground">
              총 투표 수
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>
              시스템의 최근 활동을 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground py-8 text-center">
              최근 활동 데이터를 불러오는 중입니다...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>인기 프로젝트</CardTitle>
            <CardDescription>
              가장 많은 투표를 받은 프로젝트입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground py-8 text-center">
              프로젝트 데이터를 불러오는 중입니다...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 