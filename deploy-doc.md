## Frontend static files on Clever Cloud (ftp required)

Run the following command to deploy the frontend static files on Clever Cloud:
```bash
cd polysnap-ui; ./ftp-upload.sh
```
It will build the frontend static files of angular app and upload them to Clever Cloud using ftp.

## Message servers on Clever Cloud (clever cli required)
### ReadMessageServer
These script will deploy the last commit on Clever Cloud:
```bash
cd ReadMessageServer; clever deploy
```

### WriteMessageServer
```bash
cd WriteMessageServer; clever deploy
```

## Media servers on Google Cloud Platform (gcloud cli and terraform required)
### Steps to sucsessful deployment
- Modify variables.tf to match with the project
- ````gcloud init```` Initialisation of google cloud sdk
- ````gcloud auth application-default login --project project_id```` Project authentication
- ````terraform init````
- ````terraform plan````
- ````terraform apply````
  or use deploy.sh [here](./googlecloud/mediaServerDownload/terraform/deploy.sh) once first deployment was successful 
