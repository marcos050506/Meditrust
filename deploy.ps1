Param(
    [switch]$Seed
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Start-Mongo {
    Write-Host "Starting MongoDB service (if available)..."
    try {
        $svc = Get-Service -Name MongoDB -ErrorAction Stop
        if ($svc.Status -ne 'Running') {
            Start-Service MongoDB
            Write-Host "MongoDB service started."
        } else {
            Write-Host "MongoDB already running."
        }
    } catch {
        Write-Warning "MongoDB service not found or couldn't start. Ensure MongoDB is running manually if needed."
    }
}

function Start-NodeApi {
    $dir = Join-Path $root "Sistema Medico\node-api"
    if (-Not (Test-Path $dir)) { Write-Warning "Node API folder not found: $dir"; return }
    Write-Host "Preparing Node API in $dir"
    if (-Not (Test-Path (Join-Path $dir "node_modules"))) {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd \"$dir\"; npm install" -WindowStyle Normal
        Start-Sleep -Seconds 3
    }
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd \"$dir\"; npm run start:dev" -WindowStyle Normal
    if ($Seed) { Start-Sleep -Seconds 5; Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd \"$dir\"; npm run seed" -WindowStyle Normal }
}

function Start-Frontend {
    $dir = Join-Path $root "Sistema Medico\material-react-app"
    if (-Not (Test-Path $dir)) { Write-Warning "Frontend folder not found: $dir"; return }
    Write-Host "Preparing React app in $dir"
    if (-Not (Test-Path (Join-Path $dir "node_modules"))) {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd \"$dir\"; npm install" -WindowStyle Normal
        Start-Sleep -Seconds 3
    }
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd \"$dir\"; npm start" -WindowStyle Normal
}

function Start-PythonBackend {
    $dir = Join-Path $root "backend\backend"
    if (-Not (Test-Path $dir)) { Write-Warning "Python backend folder not found: $dir"; return }
    Write-Host "Preparing Python backend in $dir"
    $venvPython = Join-Path $dir "env\Scripts\python.exe"
    if (Test-Path $venvPython) {
        Write-Host "Using venv python at $venvPython"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd \"$dir\"; & \"$venvPython\" -m pip install -r requirements.txt; & \"$venvPython\" -m pip install py2neo ollama; & \"$venvPython\" -m uvicorn main:app --port 8000" -WindowStyle Normal
    } else {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd \"$dir\"; python -m venv env; .\env\Scripts\Activate; python -m pip install -r requirements.txt; python -m pip install py2neo ollama; python -m uvicorn main:app --port 8000" -WindowStyle Normal
    }
}

Start-Mongo
Start-NodeApi
Start-Frontend
Start-PythonBackend

Write-Host "Deploy script finished. Check the newly opened windows for logs."