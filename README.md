# React Songsterr and RS Online

React based wrapper around Songsterr: Supports embedding multiple Songsterr windows in a single browser window  
RS Online supports synchronization of songsterr interactions across the network

## Scripts

### Run the development server

run the following command to run the dev server:  
`yarn start`  
this starts the development server on `localhost:3001`

### Run a build (without incrementing version number)

run the following command to build the application:  
`yarn build`  
this updates the version number (if changed in `package.json`) and builds the application

### Run a build with version increment and git commit creation

the Semantic Versioning, also known as "semver", is used:  
version: `major.minor.patch`  
run one of the following commands:  
`yarn version --patch` // increments the `patch` number of the version  
`yarn version --minor` // increments the `minor` number of the version  
`yarn verison --major` // increments the `major` number of the version  
all these three commands also create a git commit and git tag with the message:  
`v${npm_package_version}` (which is the major.minor.patch version)  
these three ccommands also perform a push to the master branch on github and push the tags

### Deploy the newly generated version to the server

prerequisites:

- the rs_online.py script should be stopped
- and the terminal running the script should be cd'd to the root dir

run the following command to deploy the new version:  
`yarn deploy`  
this removes the previous build from the server and copies the build including rs_online to the server  
also the server's IP address is changed from development pc IP to server IP  
(modify this script if a different IP address/subnet is used!)

postrequisites:

- cd the terminal back into the rs_online folder
- start the rs_online.py script: `python rs_online.py`
