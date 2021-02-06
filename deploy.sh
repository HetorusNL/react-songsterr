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
echo "finished deployment of React Songsterr!"

echo ""
echo "perform the postrequisites now"
echo "are the postrequisites performed?"
echo "Press enter to continue"
read
