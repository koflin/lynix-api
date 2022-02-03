#!/bin/bash

# This script is for production only. It sets up the production environment

echo "Copy .env file into dist"
cp ../../../../.env .

MEDIA_DIR="../../../../media"
if [ ! -d "$MEDIA_DIR" ]; then
	echo "Create media folder"
	mkdir $MEDIA_DIR
fi

echo "Link media folder"
ln -s -f $MEDIA_DIR ./media