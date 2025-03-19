@echo off
echo Stabdome senus serverius...
taskkill /F /IM php.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1

echo Valome Laravel cache...
cd /d C:\xampp\htdocs\luggage-storage
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo Paleidziame Laravel backend...
start cmd /k "cd /d C:\xampp\htdocs\luggage-storage && php artisan serve"

timeout /t 2 /nobreak >nul

echo Paleidziame React/Vite frontend...
start cmd /k "cd /d C:\xampp\htdocs\luggage-storage\frontend && npm run dev"

echo Laravel ir React sekmingai paleisti!
