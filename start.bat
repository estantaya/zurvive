@echo off
color a
if "%~1" == "" goto seljs
:start
echo Start...
set js=%~n1
cd %~dp1
title %js%
:exec
node %js%
echo Reiniciar
pause
goto exec
:seljs
set /p js="JS File: "
call :start %js%