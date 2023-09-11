#!/bin/bash

status_code=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:8000/place/1)

if [[ "$status_code" -ne 200 ]] ; then
  echo "Test place is created - FAILED"
  exit 1
else
  echo "Test place is created - OK"
fi

status_code=$(curl --write-out %{http_code} --silent --output /dev/null "http://localhost:8000/place/1/reviews?per_page=10&page=0")

if [[ "$status_code" -ne 200 ]] ; then
  echo "Test review is created - FAILED"
  exit 1
else
  echo "Test review is created - OK"
fi

status_code=$(curl --write-out %{http_code} --silent --output /dev/null "http://localhost:8000/review/1.jpg?id=1&place_id=5")

if [[ "$status_code" -ne 200 ]] ; then
  echo "Test image #1 of review - FAILED"
  exit 1
else
  echo "Test image #1 of review - OK"
fi

status_code=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:8000/place/1/image.jpg)

if [[ "$status_code" -ne 200 ]] ; then
  echo "Test place has image - FAILED"
  exit 1
else
  echo "Test place has image - OK"
fi

status_code=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:8000/profile/0xcd3B766CCDd6AE721141F452C550Ca635964ce71)

if [[ "$status_code" -ne 200 ]] ; then
  echo "Test profile is created - FAILED"
  exit 1
else
  echo "Test profile is created - OK"
fi

status_code=$(curl --write-out %{http_code} --silent --output /dev/null "http://localhost:8000/profile/0xcd3B766CCDd6AE721141F452C550Ca635964ce71/avatar.jpg")

if [[ "$status_code" -ne 200 ]] ; then
  echo "Default avatar - ERROR"
  exit 1
else
  echo "Default avatar - OK"
fi

status_code=$(curl --write-out %{http_code} --silent --output /dev/null -i -X POST -H "Content-Type: multipart/form-data" -F "file=@decentraveller-api/web-api/tests/assets/custom_avatar.jpg" http://localhost:8000/profile/0xcd3B766CCDd6AE721141F452C550Ca635964ce71/avatar.jpg)

if [[ "$status_code" -ne 200 ]] ; then
  echo "Avatar change - FAILED"
  exit 1
else
  echo "Avatar change - OK"
fi

status_code=$(curl --write-out %{http_code} --silent --output /dev/null "http://localhost:8000/place/1/similars")

if [[ "$status_code" -ne 200 ]] ; then
  echo "Test place recommendation cold start - FAILED"
  exit 1
else
  echo "Test place recommendation cold start - OK"
fi

docker-compose up embedding_updater_job

status_code=$(curl --write-out %{http_code} --silent --output /dev/null "http://localhost:8000/place/33/similars")

if [[ "$status_code" -ne 200 ]] ; then
  echo "Test place has vector recommendations - FAILED"
  exit 1
else
  echo "Test place has vector recommendations - OK"
fi

status_code=$(curl --write-out %{http_code} --silent --output /dev/null "http://localhost:8000/profile/0xcd3B766CCDd6AE721141F452C550Ca635964ce71/recommendations")

if [[ "$status_code" -ne 200 ]] ; then
  echo "Test profile has recommendations - FAILED"
  exit 1
else
  echo "Test profile has recommendations - OK"
fi

status_code=$(curl --write-out %{http_code} --silent --output /dev/null "http://localhost:8000/recommendations")

if [[ "$status_code" -ne 200 ]] ; then
  echo "Home has recommendations - FAILED"
  exit 1
else
  echo "Home has recommendations - OK"
fi

exit 0