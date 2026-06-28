echo "Sistema Medico - Setup Script"
echo ""
echo "FASE 1: Instalar Git, Node.js, Python"
echo ""

echo "Instalando Git..."
winget install -e --id Git.Git

echo "Instalando Node.js..."
winget install -e --id OpenJS.NodeJS

echo "Instalando Python 3.11..."
winget install -e --id Python.Python.3.11

echo ""
echo "Refreshing environment..."
refreshenv

echo ""
echo "FASE 2: Instalar WSL 2"
echo "Instalando WSL 2..."
wsl --install -d Ubuntu --no-launch

echo ""
echo "FASE 3: Instalar Docker"
echo "Instalando Docker Desktop..."
winget install -e --id Docker.DockerDesktop

echo ""
echo "Esperando a que Docker inicie..."
Start-Sleep -Seconds 15
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -WindowStyle Minimized
Start-Sleep -Seconds 30

echo ""
echo "FASE 4: Instalar dependencias Node"
echo "Instalando Node API..."
cd "Sistema Medico\node-api"
npm install
cd ..\..

echo ""
echo "Instalando Frontend..."
cd "Sistema Medico\material-react-app"
npm install
cd ..\..

echo ""
echo "FASE 5: Preparar Python"
echo "Configurando venv Python..."
cd "backend\backend"

if (-not (Test-Path "env")) {
    python -m venv env
}

.\env\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
pip install py2neo ollama

cd ..\..

echo ""
echo "FASE 6: Iniciar Docker Compose"
echo "Iniciando MongoDB y Neo4j..."
docker-compose up -d

echo ""
echo "=========================================="
echo "INSTALACION COMPLETADA!"
echo "=========================================="
echo ""
echo "Proximos pasos:"
echo "1. Ejecuta: powershell -ExecutionPolicy Bypass -File .\deploy.ps1"
echo ""
echo "Acceso:"
echo "  Frontend:  http://localhost:3000"
echo "  Node API:  http://localhost:4000"
echo "  FastAPI:   http://localhost:8000"
echo "  Neo4j:     http://localhost:7474"
echo ""
