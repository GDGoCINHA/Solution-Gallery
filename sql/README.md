# GDGoC Solution Gallery DB Export

이 폴더는 Supabase 데이터베이스의 주요 테이블 구조를 SQL로 내보낸 파일을 포함합니다.

## 포함된 파일
- teams.sql: 팀 정보 테이블
- members.sql: 팀 멤버 정보 테이블
- projects.sql: 프로젝트 정보 테이블
- project_tags.sql: 프로젝트 태그 테이블
- project_images.sql: 프로젝트 이미지 테이블
- project_votes.sql: 프로젝트 투표 정보 테이블
- admin_users.sql: 관리자 정보 테이블
- project_files.sql: 프로젝트 첨부파일 테이블

## 사용법
각 SQL 파일은 해당 테이블의 CREATE TABLE 문을 포함합니다. 필요한 경우 psql 또는 Supabase Studio에서 실행하여 테이블을 복원할 수 있습니다.

> 정책, 함수, 인덱스 등은 별도 추출이 필요하며, 이 폴더에는 테이블 구조만 포함되어 있습니다. 