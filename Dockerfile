# Этап 1: Сборка приложения (builder)
FROM node:22-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости (ci быстрее и надёжнее чем install)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем TypeScript в JavaScript
RUN npm run build

# Этап 2: Production образ
FROM node:22-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json для production зависимостей
COPY package*.json ./
COPY tsconfig.json ./

# Устанавливаем production зависимости + dev зависимости для миграций
RUN npm ci && npm cache clean --force

# Копируем собранное приложение из builder
COPY --from=builder /app/dist ./dist

# Копируем все исходники для миграций (они нужны для ts-node)
COPY --from=builder /app/src ./src

# Копируем скрипт запуска
COPY start.sh ./

# Создаём non-root пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Даём права на файлы приложения и делаем скрипт исполняемым
RUN chown -R nodejs:nodejs /app && chmod +x /app/start.sh

USER nodejs

# Открываем порт приложения
EXPOSE 4000

# Запускаем скрипт через sh
CMD ["sh", "/app/start.sh"]

