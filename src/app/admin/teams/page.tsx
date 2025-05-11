'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display/Card';
import { Input } from '@/components/ui/form/Input';

type Team = {
  id: string;
  name: string;
  description: string | null;
  created_at: string | null;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      console.error('팀 목록 조회 오류:', err);
      setError('팀 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!newTeam.name.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ 
          name: newTeam.name.trim(), 
          description: newTeam.description.trim() || null
        }])
        .select();
      
      if (error) throw error;
      
      setTeams([...(data || []), ...teams]);
      setNewTeam({ name: '', description: '' });
      await fetchTeams(); // 목록 새로고침
    } catch (err) {
      console.error('팀 생성 오류:', err);
      setError('팀 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateTeam(id: string) {
    if (!editData.name.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('teams')
        .update({ 
          name: editData.name.trim(), 
          description: editData.description.trim() || null 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setEditMode(null);
      await fetchTeams(); // 목록 새로고침
    } catch (err) {
      console.error('팀 수정 오류:', err);
      setError('팀 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTeam(id: string) {
    if (!window.confirm('정말로 이 팀을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchTeams(); // 목록 새로고침
    } catch (err) {
      console.error('팀 삭제 오류:', err);
      setError('팀 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(team: Team) {
    setEditMode(team.id);
    setEditData({
      name: team.name,
      description: team.description || ''
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">팀 관리</h1>
        <Button 
          onClick={() => fetchTeams()}
          disabled={loading}
        >
          새로고침
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>새 팀 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="teamName" className="text-sm font-medium">
                  팀 이름
                </label>
                <Input
                  id="teamName"
                  placeholder="팀 이름 입력"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="teamDescription" className="text-sm font-medium">
                  팀 설명
                </label>
                <Input
                  id="teamDescription"
                  placeholder="팀 설명 (선택사항)"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading || !newTeam.name.trim()}>
              팀 추가
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">팀 목록</h2>
        
        {loading && <div className="text-center py-4">로딩 중...</div>}
        
        {!loading && teams.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            등록된 팀이 없습니다.
          </div>
        )}

        {teams.map((team) => (
          <Card key={team.id} className="overflow-hidden">
            <div className="p-6">
              {editMode === team.id ? (
                // 편집 모드
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">팀 이름</label>
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">팀 설명</label>
                      <Input
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleUpdateTeam(team.id)}
                      disabled={loading || !editData.name.trim()}
                    >
                      저장
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setEditMode(null)}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                // 보기 모드
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{team.name}</h3>
                      {team.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {team.description}
                        </p>
                      )}
                      {team.created_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          생성일: {new Date(team.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startEdit(team)}
                      >
                        수정
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 