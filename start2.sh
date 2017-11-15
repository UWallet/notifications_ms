./rancher-compose --project-name notifications-ms \
--url http://192.168.99.101:8080/v1/projects/1a5 \
--access-key 917B1637E7F1F1EE8F56 \
--secret-key Vb6GNomP5Cx1ESCoJroHHGZZZcN2EVQEGSQ5zkTZ \
-f docker-compose.yml \
--verbose up \
-d --force-upgrade \
--confirm-upgrade
