@echo off
cd /d "%~dp0"
title Velvet Studio - Demo local
node "tools\start-demo.cjs"
if errorlevel 1 (
  echo.
  echo Si no se reconoce node, instala Node.js LTS desde:
  echo https://nodejs.org/en/download
  echo Despues vuelve a abrir ABRIR-VELVET.bat.
  echo Si faltan archivos, usa Extraer todo sobre el ZIP recibido.
  pause
)
