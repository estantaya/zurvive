@echo off
color a
cd "%~dp0"
echo "%~dp0"
nodemon WebServer.js --config nodemon_config.js
pause