#!/bin/bash

echo "are the prerequisites performed?"
echo "Press enter to continue"
read

echo "making sure server root mount point exists"
echo "sudo mkdir /mnt/r"
sudo mkdir /mnt/r

echo ""
echo "make sure that server root is mounted"
echo "sudo mount -t drvfs R: /mnt/r"
sudo mount -t drvfs R: /mnt/r

echo ""
echo "removing existing content from folder"
echo "sudo rm -r /mnt/r/rs.hetorus.nl/*"
sudo rm -r /mnt/r/rs.hetorus.nl/*

echo ""
echo "copying React Songsterr to the server root"
echo "cp -r build/* /mnt/r/rs.hetorus.nl/"
cp -r build/* /mnt/r/rs.hetorus.nl/

echo ""
echo "copying RS Online to the server root"
echo "cp -r rs_online/ /mnt/r/rs.hetorus.nl/"
cp -r rs_online/ /mnt/r/rs.hetorus.nl/

echo ""
echo "modifying IP address of the websockets server"
echo "sed -r 's/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/192\.168\.1\.210/' /mnt/r/rs.hetorus.nl/rs_online/rs_online.py > /mnt/r/rs.hetorus.nl/rs_online/rs_online.py.sed"
sed -r 's/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/192\.168\.1\.210/' /mnt/r/rs.hetorus.nl/rs_online/rs_online.py > /mnt/r/rs.hetorus.nl/rs_online/rs_online.py.sed
echo "mv /mnt/r/rs.hetorus.nl/rs_online/rs_online.py.sed /mnt/r/rs.hetorus.nl/rs_online/rs_online.py"
mv /mnt/r/rs.hetorus.nl/rs_online/rs_online.py.sed /mnt/r/rs.hetorus.nl/rs_online/rs_online.py

echo ""
echo "finished deployment of React Songsterr!"

echo ""
echo "perform the postrequisites now"
echo "are the postrequisites performed?"
echo "Press enter to continue"
read
