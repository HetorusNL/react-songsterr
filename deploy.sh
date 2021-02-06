#!/bin/bash
set -e

echo "making sure server root mount point exists"
echo "sudo mkdir /mnt/r"
sudo mkdir -p /mnt/r

echo ""
echo "make sure that server root is mounted"
echo "sudo mount -t drvfs R: /mnt/r"
sudo mount -t drvfs R: /mnt/r

echo ""
echo "removing existing content from folder"
echo "sudo rm -r /mnt/r/rs.hetorus.nl/*"
sudo rm -rf /mnt/r/rs.hetorus.nl/*

echo ""
echo "copying React Songsterr to the server root"
echo "cp -r build/* /mnt/r/rs.hetorus.nl/"
cp -r build/* /mnt/r/rs.hetorus.nl/

echo ""
echo "copying RS Online script to the RS Online server"
echo "scp -r rs_online/* debianvm:/opt/rs-online/"
scp -r rs_online/* debianvm:/opt/rs-online/

echo ""
echo "restarting the RS Online service on the RS Online server"
echo "ssh -t debianvm 'sudo systemctl restart rs-online.service'"
ssh -t debianvm 'sudo systemctl restart rs-online.service'

echo ""
echo "finished deployment of React Songsterr!"
