@echo off
echo ========================================
echo   DETENIENDO CHATBOT LA INMACULADA
echo ========================================
echo.

taskkill /f /im node.exe >nul 2>&1

if %errorlevel%==0 (
    echo ✅ Todos los procesos de Node.js han sido detenidos
) else (
    echo ℹ️ No se encontraron procesos de Node.js ejecutándose
)

echo.
echo ========================================
echo   CHATBOT DETENIDO COMPLETAMENTE
echo ========================================
pause
