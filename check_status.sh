status_code=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:8000/place/10)

if [[ "$status_code" -ne 200 ]] ; then
  exit 1
else
  exit 0
fi