ppshw
=====

ppshw - a colaborative document management system with node.js

Installation
------------

The following dependencies should be met, for how to install or start see below:

* node.js
 * express
 * .. other dependencies (installed via `package.json`)
* mongodb
* LibreOffice/OpenOffice (required to convert the files to pdf or other formats [not yet implemented])

First step: install express globally (requires node.js to be installed).

```shell
npm install -g express
```

Then install the application dependencies, for this you should be in the application directory (containing the `package.json`)

```shell
npm install
```

Configuration
-------------

Copy the `config.json.origin` to `config.json` and change the parameters to match your configuration. 
The upload directory (where all files are stored) is configured via `ppshw:application:upload:dir`.
To set the path to your libre/openoffice installation change the `ppshw:application:office:path`.

Running
-------

To run the application first start up mongodb:

```shell
$pathToMongodbInstallation/mongod --dbpath $dbpath 
```

To start the application:

```shell
node $pathToApp/app.js
```


Hints
-----

Developers: hotnode can be handy for automatically restart your node.js application when you edit some code.
Install it via:

```shell
npm install -g hotnode
```

To run your application with "hot code" replace start it with:

```shell
hotnode $pathToApp/app.js
```
