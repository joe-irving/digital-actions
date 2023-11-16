# Check DB connection
TRIES=10

i=$TRIES

while [ $i -gt 0 ];
do
    yarn run prisma migrate deploy
    if [ "$?" -eq 0 ]; then
        echo "Migrations sucessful"
        break
    else
        echo "Failed connect to database"
    fi
    i=$(($i-1))
    if [ $i -gt 0 ]; then
      echo "Trying again in 5 seconds..."
      sleep 5
    fi
done
