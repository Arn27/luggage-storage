@echo off
echo Paleidziame darbo aplinka...

:: 1️⃣ Paleidziame XAMPP
echo Paleidziame XAMPP...
start "" "C:\xampp\xampp-control.exe"
timeout /t 1 /nobreak >nul

:: 2️⃣ Paleidziame Laravel backend (paslepta)
echo Paleidziame Laravel backend...
start /b cmd /c "cd /d C:\xampp\htdocs\luggage-storage && php artisan serve"
timeout /t 1 /nobreak >nul

:: 3️⃣ Paleidziame React/Vite frontend (paslepta)
echo Paleidziame React/Vite frontend...
start /b cmd /c "cd /d C:\xampp\htdocs\luggage-storage\frontend && npm run dev"
timeout /t 1 /nobreak >nul

:: 4️⃣ Paleidziame GitHub Desktop
echo Paleidziame GitHub Desktop...
start "" "C:\Users\%USERNAME%\AppData\Local\GitHubDesktop\GitHubDesktop.exe"
timeout /t 1 /nobreak >nul

:: 5️⃣ Paleidziame Visual Studio Code su dviem atskirais langais (NEBLOKUOJA vykdymo)
echo Paleidziame Visual Studio Code...
start /b code --new-window "C:\xampp\htdocs\luggage-storage"
timeout /t 1 /nobreak >nul
start /b code --new-window "C:\xampp\htdocs\luggage-storage\frontend"
timeout /t 1 /nobreak >nul

:: 6️⃣ Paleidziame Chrome su front-end puslapiu
echo Paleidziame Chrome...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://localhost:5173
timeout /t 1 /nobreak >nul

echo ✅ Viskas paleista, gali pradeti darba!
