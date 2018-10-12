# connectify.js-symfony3.4

* Installation:
  install Composer, Mysql, RabbitMq, etc.
  in the root folder:

```sh
  composer install
  php bin/console doctrine:database:createcomposer install
  php bin/console doctrine:schema:update --force
  cd .\nodeReceive\ 
  npm install
```

* Usage:
  in the root folder:

```sh
  php bin/console server:run
  node .\nodeReceive\receive.js
```

open
http://localhost:3000/
