#!/bin/bash
# Deployment script for Nonogram Editor on Raspberry Pi

# Exit on any error
set -e

echo "Starting deployment of Nonogram Editor on Raspberry Pi..."

# Check if directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "Error: backend and/or frontend directories not found!"
    echo "This script should be run from the project root directory."
    exit 1
fi

# 1. Build the frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Set up the backend
echo "Setting up backend..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# 3. Create systemd service file
echo "Creating systemd service..."
cat > nonogram-api.service << EOF
[Unit]
Description=Nonogram Editor API
After=network.target

[Service]
User=$(whoami)
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/venv/bin/gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app -b 0.0.0.0:8000
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# 4. Create Nginx configuration
echo "Creating Nginx configuration..."
cat > nonogram-editor.conf << EOF
server {
    listen 80;
    server_name localhost;

    # Serve static frontend files
    location / {
        root $(pwd)/../frontend/build;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests to the backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF
cd ..

echo
echo "Deployment files created successfully!"
echo
echo "Next steps for manual installation:"
echo "1. Copy the systemd service file to system directory:"
echo "   sudo cp backend/nonogram-api.service /etc/systemd/system/"
echo
echo "2. Enable and start the service:"
echo "   sudo systemctl enable nonogram-api.service"
echo "   sudo systemctl start nonogram-api.service"
echo
echo "3. Copy the Nginx configuration:"
echo "   sudo cp backend/nonogram-editor.conf /etc/nginx/sites-available/"
echo "   sudo ln -s /etc/nginx/sites-available/nonogram-editor.conf /etc/nginx/sites-enabled/"
echo
echo "4. Test Nginx configuration and restart:"
echo "   sudo nginx -t"
echo "   sudo systemctl restart nginx"
echo
echo "Done! Your Nonogram Editor should now be available at http://your_raspberry_pi_ip" 