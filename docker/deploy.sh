docker stop chatr-frontend
docker stop chatr-backend
echo y | docker rm chatr-frontend
echo y | docker rm chatr-backend
docker rmi chatr-frontend
docker rmi chatr-backend
docker-compose up backend frontend
