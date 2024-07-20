cd .. || exit
npm install

dateString=$(date +%s)

cd ./terraform || exit
echo $dateString | terraform apply -auto-approve

# Point 100% of the traffic to the new version
gcloud app services set-traffic mediadownloadservice --splits=$dateString=1 --quiet