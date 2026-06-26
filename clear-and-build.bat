@echo off
echo ==========================================
echo CampusLoop Cleaning and Building Script
echo ==========================================

echo.
echo [1/3] Cleaning Laravel Backend Caches...
cd backend
call php artisan cache:clear
call php artisan config:clear
call php artisan route:clear
call php artisan view:clear
call php artisan optimize:clear
cd ..

echo.
echo [2/3] Building Frontend (React/Vite)...
call npm run build

echo.
echo [3/3] Done! 
echo You can now run "php artisan serve" inside the backend folder to serve the production app.
echo NOTE: For local development with Hot Module Replacement (HMR), run "npm run dev" and access http://localhost:8080/ directly to avoid SSR deadlocks.
echo.
pause
