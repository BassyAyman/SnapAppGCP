#!/bin/bash

# Generate static files
ng build

# Configuration FTP
serveur_ftp="app-703816fc-4a42-46cd-a3b0-c391f771c295-fsbucket.services.clever-cloud.com"
utilisateur="user703816fc"
mot_de_passe="mjtOjm5ByK3V90kT"
repertoire_distant="/"  # Le répertoire distant cible sur le serveur FTP
repertoire_local="dist/polysnap-ui"  # Le répertoire local contenant les fichiers à téléverser

# Se connecter au serveur FTP et téléverser les fichiers
ftp -n <<END_SCRIPT
open $serveur_ftp
user $utilisateur $mot_de_passe
binary
cd $repertoire_distant
lcd $repertoire_local
prompt
mput *
bye
END_SCRIPT

exit 0
