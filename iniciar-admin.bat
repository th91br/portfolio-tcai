@echo off
title TCAI - Central Admin & Agente WhatsApp
cd /d "%~dp0"
cls
echo =====================================================================
echo           TCAI - INICIALIZADOR UNIFICADO 1-CLIQUE
echo =====================================================================
echo.
echo  [1/2] Iniciando Servidor do Agente WhatsApp (Porta 3080)...
echo  [2/2] Iniciando Servidor Vite Frontend & Admin (Porta 5173)...
echo.
echo  Aguarde... Seu navegador abrira automaticamente com o Admin completo!
echo =====================================================================
echo.

node scripts/launch-all.js

pause
