.PHONY: dev

dev:
	# Запуск Docker (LiveKit + Redis) в фоне
	docker-compose up -d
	# Запуск бэкенда и фронтенда параллельно
	(cd server && go run main.go) & (cd client && npm run dev)

stop:
	docker-compose down
	pkill -f "go run main.go" || true