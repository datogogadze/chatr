docker stop speakr-frontend
docker stop speakr-backend
echo y | docker rm speakr-frontend
echo y | docker rm speakr-backend
docker rmi speakr-frontend
docker rmi speakr-backend
docker-compose up backend frontend
