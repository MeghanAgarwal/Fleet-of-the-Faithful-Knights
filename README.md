## Fleet of the Faithful Knights Voting Panel

This is the voting panel for the Fleet of the Faithful Knights (FFK) Star Citizen organisation.

This project is for the most part all functional codebase wise. No imperative stuff here. As a functional codebase, expect to see Option, Either, List, Set and Map data structures everywhere. 

Pretty much just plug and play.

#### Dependencies:

Name                      | Version
------------------------- | -------
TypeScript                | 3.6.4
TypeScript Compiler (TSC) | 1.20150623.0
Concurrently              | 5.0.0
Nodemon                   | 1.19.4

One line install command:

```npm i -g typescript tsc concurrently nodemon```

The TypeScript compiler should come bundled with TypeScript however it doesn't hurt to be sure.

#### Windows

* navigate to the cloned directory
* run ```npm i``` to install all packages
* run ```npm run initialise-dev``` to both compile and run

#### Linux 

The following was tested on Ubuntu 18.04 but should work across the board.

* navigate to the cloned directory
* run ```npm i``` to install all packages
* run ```npm run initialise-dev``` to both compile and run

In some cases you may need to run ```sudo npm i``` to install the dependencies. This is an issue related to your npm installation or configuration and not the repository. If you want to fix this, there are many resources out there that can help you to do so.
