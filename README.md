## Deployment
Go to [Deployment Doc](./deploy-doc.md)

## Run locally

### Launch UI
In the directory `polysnap-ui`, launch the script `start-prod` from the package.json or the script start if you want to use local services.

### Launch message servers
In the directory `ReadMessageServer` or `WriteMessageServer`, launch the Spring application with the following environment variables:
- POSTGRESQL_ADDON_USER=user
- POSTGRESQL_ADDON_PASSWORD=password
- POSTGRESQL_ADDON_DB=mydb
- POSTGRESQL_ADDON_PORT=5432
- POSTGRESQL_ADDON_HOST=localhost
- MEDIA_SERVER_URL=http://first-function-399016.oa.r.appspot.com
- TOKEN_SECRET="the secret token to have access to read and write message servers"

### Launch message server database
Create a postgresql database with the following command:
```bash
docker run --name my_postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mydb -p 5432:5432 -e POSTGRES_HOST=localhost -d postgres:13
```

### Launch media servers
Go to `googlecloud` directory and run `node index.js`
You first need to have a file named “key.json” in the “config” directory with the information to connect to the storage bucket.


## URLs
### Frontend
https://app-703816fc-4a42-46cd-a3b0-c391f771c295.cleverapps.io

### Upload Media Server (javascript on Google App Engine)
http://first-function-399016.oa.r.appspot.com  
Used by Frontend

### Download Media Server
https://mediadownloadservice-dot-first-function-399016.oa.r.appspot.com  
Used by Frontend and Write Message Server

### Media Storage (Bucket Google Cloud Storage)
https://console.cloud.google.com/storage/browser/polysnap_media_storage;tab=objects?forceOnBucketsSortingFiltering=true&project=first-function-399016&prefix=&forceOnObjectsSortingFiltering=true  
Used by Upload and Download Media Servers

### Write Message Server (spring on Clever Cloud)
https://app-d8af538d-b1aa-44b8-896c-5b7c317631ef.cleverapps.io  
Used by frontend

### Read Message Server (spring on Clever Cloud)
https://app-e99c4068-2ad7-496c-927e-765c5ef72da5.cleverapps.io  
Used by frontend

### Message Database (postgres on Clever Cloud)
bovfrk6dxljcrys06sgh-postgresql.services.clever-cloud.com  
Used by Read and Write Message Servers
