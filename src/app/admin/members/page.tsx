'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/base/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display/Card';
import { Input } from '@/components/ui/form/Input';
import Image from 'next/image';

type Member = {
  id: string;
  team_id: string | null;
  name: string;
  affiliation: string | null;
  profile_image_url: string | null;
  role: string | null;
  created_at: string | null;
  team_name?: string;
  social_url?: string | null;
};

type Team = {
  id: string;
  name: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    affiliation: '',
    role: '',
    team_id: '',
    social_url: '',
    profile_image_url: ''
  });
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    affiliation: '',
    role: '',
    team_id: '',
    social_url: '',
    profile_image_url: ''
  });

  // 검색 필터
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState<string | 'all'>('all');

  // 프로필 이미지 업로드 관련 상태
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageUploadProgress, setProfileImageUploadProgress] = useState(0);

  useEffect(() => {
    // 팀 목록 불러오기
    fetchTeams();
    // 멤버 목록 불러오기
    fetchMembers();
  }, []);

  // 검색 결과 필터링
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.affiliation?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (member.role?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesTeam = teamFilter === 'all' || member.team_id === teamFilter;
    
    return matchesSearch && matchesTeam;
  });

  async function fetchTeams() {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      console.error('팀 목록 조회 오류:', err);
    }
  }

  async function fetchMembers() {
    setLoading(true);
    setError(null);
    try {
      // 멤버와 팀 정보 조인하여 가져오기
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          teams:team_id (name)
        `)
        .order('name');
      
      if (error) throw error;
      
      // 팀 이름을 멤버 객체에 추가
      const membersWithTeamName = (data || []).map(m => ({
        ...m,
        team_name: m.teams?.name || '팀 없음'
      }));
      
      setMembers(membersWithTeamName);
    } catch (err) {
      console.error('멤버 목록 조회 오류:', err);
      setError('멤버 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  function handleProfileImageChange(e: React.ChangeEvent<HTMLInputElement>, setImage: (f: File | null) => void, setPreview: (s: string | null) => void) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function uploadProfileImage(file: File, memberId: string) {
    const fileName = `${memberId}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = `members/${fileName}`;
    setProfileImageUploadProgress(10);
    const { error } = await supabase.storage.from('member-profiles').upload(filePath, file, { upsert: true });
    if (error) return null;
    setProfileImageUploadProgress(80);
    const { data } = supabase.storage.from('member-profiles').getPublicUrl(filePath);
    setProfileImageUploadProgress(100);
    return data.publicUrl;
  }

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!newMember.name.trim()) return;
    setLoading(true);
    try {
      // 1. 멤버 DB 생성
      const { data: inserted, error } = await supabase
        .from('members')
        .insert([{
          name: newMember.name.trim(),
          affiliation: newMember.affiliation.trim() || null,
          role: newMember.role.trim() || null,
          team_id: newMember.team_id || null,
          social_url: newMember.social_url || null
        }])
        .select()
        .single();
      if (error) throw error;
      // 2. 프로필 이미지 업로드
      if (profileImage && inserted) {
        const url = await uploadProfileImage(profileImage, inserted.id);
        if (url) {
          await supabase.from('members').update({ profile_image_url: url }).eq('id', inserted.id);
        }
      }
      setNewMember({ name: '', affiliation: '', role: '', team_id: '', social_url: '', profile_image_url: '' });
      setProfileImage(null);
      setProfileImagePreview(null);
      await fetchMembers();
    } catch (err) {
      console.error('멤버 생성 오류:', err);
      setError('멤버 생성에 실패했습니다.');
    } finally {
      setLoading(false);
      setProfileImageUploadProgress(0);
    }
  }

  async function handleUpdateMember(id: string) {
    if (!editData.name.trim()) return;
    setLoading(true);
    try {
      // 1. 멤버 DB 수정
      await supabase
        .from('members')
        .update({
          name: editData.name.trim(),
          affiliation: editData.affiliation.trim() || null,
          role: editData.role.trim() || null,
          team_id: editData.team_id || null,
          social_url: editData.social_url || null
        })
        .eq('id', id);
      // 2. 프로필 이미지 업로드
      if (profileImage) {
        const url = await uploadProfileImage(profileImage, id);
        if (url) {
          await supabase.from('members').update({ profile_image_url: url }).eq('id', id);
        }
      }
      setEditMode(null);
      setProfileImage(null);
      setProfileImagePreview(null);
      await fetchMembers();
    } catch (err) {
      console.error('멤버 수정 오류:', err);
      setError('멤버 수정에 실패했습니다.');
    } finally {
      setLoading(false);
      setProfileImageUploadProgress(0);
    }
  }

  async function handleDeleteMember(id: string) {
    if (!window.confirm('정말로 이 멤버를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchMembers(); // 목록 새로고침
    } catch (err) {
      console.error('멤버 삭제 오류:', err);
      setError('멤버 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(member: Member) {
    setEditMode(member.id);
    setEditData({
      name: member.name,
      affiliation: member.affiliation || '',
      role: member.role || '',
      team_id: member.team_id || '',
      social_url: member.social_url || '',
      profile_image_url: member.profile_image_url || ''
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">멤버 관리</h1>
        <Button 
          onClick={() => fetchMembers()}
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

      {/* 새 멤버 추가 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>새 멤버 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateMember} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="memberName" className="text-sm font-medium">
                  이름 *
                </label>
                <Input
                  id="memberName"
                  placeholder="멤버 이름 입력"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="memberTeam" className="text-sm font-medium">
                  소속 팀
                </label>
                <select
                  id="memberTeam"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newMember.team_id}
                  onChange={(e) => setNewMember({ ...newMember, team_id: e.target.value })}
                >
                  <option value="">팀 선택 (선택사항)</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="memberAffiliation" className="text-sm font-medium">
                  소속
                </label>
                <Input
                  id="memberAffiliation"
                  placeholder="소속 (학교, 기관 등)"
                  value={newMember.affiliation}
                  onChange={(e) => setNewMember({ ...newMember, affiliation: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="memberRole" className="text-sm font-medium">
                  역할
                </label>
                <Input
                  id="memberRole"
                  placeholder="역할 (직책, 담당 분야 등)"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">프로필 이미지</label>
                <div className="flex items-center gap-4">
                  {profileImagePreview ? (
                    <>
                      <Image src={profileImagePreview} alt="미리보기" className="w-16 h-16 rounded-full object-cover" width={64} height={64} />
                      <p className="text-xs text-muted-foreground mt-1">이미지 선택 후 <b>멤버 추가</b>를 눌러야 반영됩니다.</p>
                    </>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    ref={profileImageInputRef}
                    onChange={e => handleProfileImageChange(e, setProfileImage, setProfileImagePreview)}
                  />
                </div>
                {profileImageUploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${profileImageUploadProgress}%` }}></div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">소셜 링크</label>
                <Input
                  placeholder="https://github.com/username 또는 SNS/포트폴리오 URL"
                  value={newMember.social_url}
                  onChange={e => setNewMember({ ...newMember, social_url: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading || !newMember.name.trim()}>
              멤버 추가
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 검색 및 필터링 */}
      <Card>
        <CardHeader>
          <CardTitle>멤버 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                멤버 검색
              </label>
              <Input
                id="search"
                placeholder="이름, 소속, 역할 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="teamFilter" className="text-sm font-medium">
                팀 필터
              </label>
              <select
                id="teamFilter"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <option value="all">모든 팀</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setTeamFilter('all');
                }}
                variant="outline"
                className="mb-0.5"
              >
                필터 초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 멤버 목록 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">멤버 목록</h2>
          <p className="text-sm text-muted-foreground">
            총 {filteredMembers.length}명의 멤버
          </p>
        </div>
        
        {loading && <div className="text-center py-4">로딩 중...</div>}
        
        {!loading && filteredMembers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm || teamFilter !== 'all' ? 
              '검색 조건에 맞는 멤버가 없습니다.' : 
              '등록된 멤버가 없습니다.'}
          </div>
        )}

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="p-6">
                {editMode === member.id ? (
                  // 편집 모드
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">이름 *</label>
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">소속 팀</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editData.team_id}
                        onChange={(e) => setEditData({ ...editData, team_id: e.target.value })}
                      >
                        <option value="">팀 선택 (선택사항)</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">소속</label>
                      <Input
                        value={editData.affiliation}
                        onChange={(e) => setEditData({ ...editData, affiliation: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">역할</label>
                      <Input
                        value={editData.role}
                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">프로필 이미지</label>
                      <div className="flex items-center gap-4">
                        {profileImagePreview ? (
                          <>
                            <Image src={profileImagePreview} alt="미리보기" className="w-16 h-16 rounded-full object-cover" width={64} height={64} />
                            <p className="text-xs text-muted-foreground mt-1">이미지 선택 후 <b>저장</b>을 눌러야 반영됩니다.</p>
                          </>
                        ) : editData.profile_image_url ? (
                          <Image src={editData.profile_image_url} alt="기존 이미지" className="w-16 h-16 rounded-full object-cover" width={64} height={64} />
                        ) : null}
                        <input
                          type="file"
                          accept="image/*"
                          ref={profileImageInputRef}
                          onChange={e => handleProfileImageChange(e, setProfileImage, setProfileImagePreview)}
                        />
                      </div>
                      {profileImageUploadProgress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${profileImageUploadProgress}%` }}></div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">소셜 링크</label>
                      <Input
                        placeholder="https://github.com/username 또는 SNS/포트폴리오 URL"
                        value={editData.social_url}
                        onChange={e => setEditData({ ...editData, social_url: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleUpdateMember(member.id)}
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
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        {member.team_name && member.team_name !== '팀 없음' && (
                          <p className="text-sm text-blue-600">
                            {member.team_name}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEdit(member)}
                        >
                          수정
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                    
                    {member.profile_image_url && (
                      <div className="mt-2">
                        <Image 
                          src={member.profile_image_url} 
                          alt={member.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-full" 
                        />
                      </div>
                    )}
                    
                    <div className="pt-2">
                      {member.affiliation && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">소속:</span> {member.affiliation}
                        </p>
                      )}
                      {member.role && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">역할:</span> {member.role}
                        </p>
                      )}
                      {member.created_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          등록일: {new Date(member.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 