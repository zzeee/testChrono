# testChrono
Установка: 

npm install

запуск (пока раздельно):

npm run startnode
npm run startreact
npm run startphp

Занимает порты 3000,  8080

клиентское приложение запускается на порту 8080

при старте node приложение требует Mongo и Rabbit, по умолчанию коннектится к localhost строки подключения к ним - в начале файлах nodeserver/index.js и index.php

npm run test - запускает тесты node
npm run testr - запускает тесты клиентского приложения

npm run doc - запускает генерацию документации через jsdoc (только для node)

тестов отдельно php части нет. В интеграционном тесте есть проверка работы php 





