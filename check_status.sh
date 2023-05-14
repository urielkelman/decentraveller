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

status_code=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:8000/profile/0xcd3B766CCDd6AE721141F452C550Ca635964ce71)

if [[ "$status_code" -ne 200 ]] ; then
  echo "Test profile is created - FAILED"
  exit 1
else
  echo "Test profile is created - OK"
fi

exit 0