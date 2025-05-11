# 1단계: 빌드 환경
FROM node:18 AS builder

ARG APP_DIR=/app
WORKDIR ${APP_DIR}

# package.json과 package-lock.json을 먼저 복사하고, npm install 실행
COPY package.json package-lock.json ./
RUN npm install

# .env 파일을 먼저 복사
COPY .env ./

# 이후 전체 파일 복사
COPY . .

# next.config.ts 확인
RUN cat next.config.ts

# 빌드 실행 (output: export가 있는지 확인)
# 명시적으로 next build 명령 사용
RUN npx next build

# 빌드 결과 확인
RUN ls -la ${APP_DIR}
RUN ls -la ${APP_DIR}/.next || echo ".next 디렉토리가 없습니다"
RUN ls -la ${APP_DIR}/out || echo "out 디렉토리가 없습니다"

# 2단계: 실행 환경
FROM node:18

ARG APP_DIR=/app
WORKDIR ${APP_DIR}

# 프로덕션 의존성만 가져오기
COPY package*.json ./
RUN npm install --omit=dev

# .env 파일 복사
COPY .env ./

# 빌드된 결과물 가져오기
COPY --from=builder ${APP_DIR}/.next ./.next
COPY --from=builder ${APP_DIR}/public ./public
COPY --from=builder ${APP_DIR}/node_modules ./node_modules
COPY --from=builder ${APP_DIR}/package.json ./package.json
COPY --from=builder ${APP_DIR}/next.config.ts ./next.config.ts

# 실행환경 확인
RUN ls -la ${APP_DIR}
RUN ls -la ${APP_DIR}/.next || echo ".next 디렉토리가 없습니다"

EXPOSE 3001

# Next.js 서버 시작
CMD ["npm", "run", "start"]