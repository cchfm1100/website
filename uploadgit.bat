@echo off
chcp 65001 >nul
setlocal EnableExtensions DisableDelayedExpansion

rem 預設 jsDelivr CDN 上傳位置；GitHub owner/repo/branch/path 會從這條字串切割取得
set "DEFAULT_UPLOAD_URL=https://cdn.jsdelivr.net/gh/cchfm1100/website@20260610/"
set "CDN_PREFIX=https://cdn.jsdelivr.net/gh/"

rem 可直接按 Enter 使用預設上傳位置
set "UPLOAD_URL="
echo.
echo 預設上傳位置：%DEFAULT_UPLOAD_URL%
set /p "UPLOAD_URL=請輸入上傳位置 URL，或直接按 Enter 使用預設: "
if "%UPLOAD_URL%"=="" set "UPLOAD_URL=%DEFAULT_UPLOAD_URL%"

rem 驗證並切掉 CDN prefix: https://cdn.jsdelivr.net/gh/
if /i not "%UPLOAD_URL:~0,28%"=="%CDN_PREFIX%" (
  echo [ERROR] URL 格式必須是：%CDN_PREFIX%owner/repo@branch/path
  exit /b 1
)
set "CDN_PATH=%UPLOAD_URL:~28%"

rem 由 CDN_PATH 切出 GitHub owner
for /f "tokens=1* delims=/" %%A in ("%CDN_PATH%") do (
  set "GH_OWNER=%%A"
  set "CDN_REST=%%B"
)

if not defined GH_OWNER (
  echo [ERROR] 無法從 URL 取得 GitHub owner。
  exit /b 1
)
if not defined CDN_REST (
  echo [ERROR] 無法從 URL 取得 GitHub repo。
  exit /b 1
)

rem 由剩餘字串切出 GitHub repo 與 branch/path
for /f "tokens=1* delims=@" %%A in ("%CDN_REST%") do (
  set "GH_REPO=%%A"
  set "CDN_VERSION=%%B"
)

if not defined GH_REPO (
  echo [ERROR] 無法從 URL 取得 GitHub repo。
  exit /b 1
)

rem 若 URL 沒寫 @branch，預設使用 main
if not defined CDN_VERSION (
  set "BRANCH_NAME=main"
  set "UPLOAD_SUBPATH="
) else (
  for /f "tokens=1* delims=/" %%A in ("%CDN_VERSION%") do (
    set "BRANCH_NAME=%%A"
    set "UPLOAD_SUBPATH=%%B"
  )
)

if not defined BRANCH_NAME set "BRANCH_NAME=main"

rem 由 CDN 字串自動組出 GitHub remote 與本機資料夾
set "REMOTE_URL=https://github.com/%GH_OWNER%/%GH_REPO%.git"
set "REPO_DIR=%USERPROFILE%\Downloads\%GH_REPO%"

rem 正規化子路徑。原本的寫法在空路徑時可能產生錯誤的子路徑。
set "LOCAL_SUBPATH="
if defined UPLOAD_SUBPATH call :NormalizeSubpath "%UPLOAD_SUBPATH%"

if defined LOCAL_SUBPATH (
  set "UPLOAD_LOCAL_DIR=%REPO_DIR%\%LOCAL_SUBPATH%"
) else (
  set "UPLOAD_LOCAL_DIR=%REPO_DIR%"
)

echo.
echo [INFO] GitHub repo : %GH_OWNER%/%GH_REPO%
echo [INFO] Branch      : %BRANCH_NAME%
echo [INFO] Remote URL  : %REMOTE_URL%
echo [INFO] 本機資料夾  : %REPO_DIR%
echo [INFO] 對應路徑    : %UPLOAD_LOCAL_DIR%
echo.

rem CMD 內詢問 GitHub 帳號與 Token
set "LOGIN_USERNAME="
set "LOGIN_PASSWORD="
set /p "LOGIN_USERNAME=請輸入 GitHub 帳號: "
if "%LOGIN_USERNAME%"=="" (
  echo [ERROR] 未輸入 GitHub 帳號。
  exit /b 1
)

for /f "usebackq delims=" %%P in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=Read-Host '請輸入 GitHub Personal Access Token' -AsSecureString; $b=[Runtime.InteropServices.Marshal]::SecureStringToBSTR^($p^); try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR^($b^) } finally { if ^($b -ne [IntPtr]::Zero^) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR^($b^) } }"`) do set "LOGIN_PASSWORD=%%P"

if not defined LOGIN_PASSWORD (
  echo [ERROR] 未輸入 GitHub Personal Access Token。
  exit /b 1
)

rem 用 Authorization header 認證，不把 Token 塞進 URL，避免 @、:、/、% 等字元造成 Git URL malformed。
set "AUTH_HEADER="
for /f "usebackq delims=" %%H in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "$pair=$env:LOGIN_USERNAME + ':' + $env:LOGIN_PASSWORD; $bytes=[Text.Encoding]::UTF8.GetBytes^($pair^); 'Authorization: Basic ' + [Convert]::ToBase64String^($bytes^)"`) do set "AUTH_HEADER=%%H"

if not defined AUTH_HEADER (
  echo [ERROR] 認證資料轉換失敗。
  exit /b 1
)

rem 確認 Git 可用
git --version >nul 2>&1
if errorlevel 1 (
  echo [ERROR] 找不到 git，請先安裝 https://git-scm.com/download/win 並重新開啟 CMD。
  exit /b 1
)

rem 建立/切換本機 repo 資料夾
if not exist "%REPO_DIR%" mkdir "%REPO_DIR%" || exit /b 1
if not exist "%UPLOAD_LOCAL_DIR%" mkdir "%UPLOAD_LOCAL_DIR%" || exit /b 1
cd /d "%REPO_DIR%" || exit /b 1

git rev-parse --git-dir >nul 2>&1 || git init || exit /b 1

git config user.name "%LOGIN_USERNAME%" || exit /b 1
git config user.email "%LOGIN_USERNAME%@users.noreply.github.com" || exit /b 1

git remote -v | findstr /i "origin" >nul
if errorlevel 1 (
  git remote add origin "%REMOTE_URL%" || exit /b 1
) else (
  git remote set-url origin "%REMOTE_URL%" || exit /b 1
)

rem 嘗試抓取遠端 branch；如果遠端還沒有 branch，忽略錯誤
git -c "http.extraHeader=%AUTH_HEADER%" fetch "%REMOTE_URL%" "%BRANCH_NAME%" >nul 2>&1

git rev-parse --verify HEAD >nul 2>&1
if errorlevel 1 (
  git add -A
  git commit -m "Initial commit" || (
    if not exist ".gitkeep" echo placeholder>.gitkeep
    git add .gitkeep
    git commit -m "Initial commit (placeholder)" || exit /b 1
  )
) else (
  git add -A
  git diff --cached --quiet
  if errorlevel 1 (
    git commit -m "Update" || exit /b 1
  ) else (
    echo [INFO] 沒有偵測到新的變更，仍會推送目前 branch。
  )
)

git branch -M "%BRANCH_NAME%" || exit /b 1

rem 使用臨時 Authorization header 推送，不把密碼寫入 .git/config 或 URL
git -c "http.extraHeader=%AUTH_HEADER%" push --force "%REMOTE_URL%" "%BRANCH_NAME%:%BRANCH_NAME%"
set "PUSH_EXIT=%ERRORLEVEL%"

rem 清除敏感變數
set "LOGIN_PASSWORD="
set "AUTH_HEADER="

if not "%PUSH_EXIT%"=="0" (
  echo [ERROR] 推送失敗。
  exit /b %PUSH_EXIT%
)

echo.
echo [OK] 已推送到：%REMOTE_URL%
echo [OK] CDN 對應位置：%UPLOAD_URL%

endlocal
exit /b 0

:NormalizeSubpath
set "LOCAL_SUBPATH=%~1"

:NormalizeSubpathTrimLeading
if not defined LOCAL_SUBPATH exit /b 0
if "%LOCAL_SUBPATH:~0,1%"=="/" (
  set "LOCAL_SUBPATH=%LOCAL_SUBPATH:~1%"
  goto NormalizeSubpathTrimLeading
)

:NormalizeSubpathTrimTrailing
if not defined LOCAL_SUBPATH exit /b 0
if "%LOCAL_SUBPATH:~-1%"=="/" (
  set "LOCAL_SUBPATH=%LOCAL_SUBPATH:~0,-1%"
  goto NormalizeSubpathTrimTrailing
)

if not defined LOCAL_SUBPATH exit /b 0
set "LOCAL_SUBPATH=%LOCAL_SUBPATH:/=\%"
exit /b 0
