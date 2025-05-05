# Deployment Guide - Nonogram SPA Editor

This guide provides instructions for deploying the Nonogram SPA Editor application in various environments, with a focus on deployment to a Raspberry Pi as specified in the requirements document.

## Prerequisites

Before deploying, ensure you have the following:

- Access to the target deployment environment
- Git installed
- Python 3.8+ installed
- Node.js 16+ and npm installed
- Basic understanding of web servers and reverse proxies

## Local Development Deployment

### Backend Setup

1. Clone the repository:
   ```powershell
   git clone https://github.com/akram0zaki/nonograms-repo.git
   cd nonograms-repo/backend
   ```

2. Create a virtual environment:
   ```powershell
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # OR
   source .venv/bin/activate  # Linux/macOS
   ```

3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```powershell
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```powershell
   cd ../frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev
   ```

## Production Deployment on Raspberry Pi

### System Preparation

1. Update your Raspberry Pi:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. Install required packages:
   ```bash
   sudo apt install -y python3-pip python3-venv nodejs npm git nginx
   ```

### Backend Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/akram0zaki/nonograms-repo.git
   cd nonograms-repo/backend
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a systemd service file for the backend:
   ```bash
   sudo nano /etc/systemd/system/nonogram-api.service
   ```

5. Add the following content (adjust paths as needed):
   ```ini
   [Unit]
   Description=Nonogram API
   After=network.target

   [Service]
   User=pi
   WorkingDirectory=/home/pi/nonograms-repo/backend
   ExecStart=/home/pi/nonograms-repo/backend/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
   Restart=always
   StandardOutput=journal
   StandardError=journal
   SyslogIdentifier=nonogram-api
   Environment="PATH=/home/pi/nonograms-repo/backend/.venv/bin"

   [Install]
   WantedBy=multi-user.target
   ```

6. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable nonogram-api
   sudo systemctl start nonogram-api
   ```

### Frontend Deployment

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend for production:
   ```bash
   npm run build
   ```

4. Configure Nginx as a reverse proxy:
   ```bash
   sudo nano /etc/nginx/sites-available/nonogram
   ```

5. Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name nonogram.local;  # Replace with your domain or IP

       location / {
           root /home/pi/nonograms-repo/frontend/build;
           index index.html;
           try_files $uri $uri/ /index.html;
       }

       location /api/ {
           proxy_pass http://localhost:8000/api/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

6. Enable the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/nonogram /etc/nginx/sites-enabled/
   sudo nginx -t  # Test the configuration
   sudo systemctl restart nginx
   ```

## Cloudflare Tunnel Setup

To make your Raspberry Pi accessible from the internet without port forwarding, you can use Cloudflare Tunnels:

1. Create a Cloudflare account if you don't have one.

2. Install cloudflared on your Raspberry Pi:
   ```bash
   wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -O cloudflared
   chmod +x cloudflared
   sudo mv cloudflared /usr/local/bin/
   ```

3. Authenticate cloudflared:
   ```bash
   cloudflared tunnel login
   ```

4. Create a tunnel:
   ```bash
   cloudflared tunnel create nonogram
   ```

5. Configure the tunnel:
   ```bash
   sudo nano ~/.cloudflared/config.yml
   ```

6. Add the following configuration:
   ```yaml
   tunnel: YOUR_TUNNEL_ID
   credentials-file: /home/pi/.cloudflared/YOUR_TUNNEL_ID.json
   
   ingress:
     - hostname: nonogram.yourdomain.com
       service: http://localhost:80
     - service: http_status:404
   ```

7. Create a systemd service for cloudflared:
   ```bash
   sudo nano /etc/systemd/system/cloudflared.service
   ```

8. Add the following content:
   ```ini
   [Unit]
   Description=Cloudflare Tunnel
   After=network.target

   [Service]
   User=pi
   ExecStart=/usr/local/bin/cloudflared tunnel --config /home/pi/.cloudflared/config.yml run
   Restart=always
   StandardOutput=journal
   StandardError=journal
   SyslogIdentifier=cloudflared

   [Install]
   WantedBy=multi-user.target
   ```

9. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable cloudflared
   sudo systemctl start cloudflared
   ```

10. Configure your DNS in the Cloudflare dashboard to point to the tunnel.

## Docker Deployment (Optional)

For containerized deployment, you can use Docker:

### Create Dockerfile for Backend

Create a file named `Dockerfile` in the backend directory:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Create Dockerfile for Frontend

Create a file named `Dockerfile` in the frontend directory:

```dockerfile
FROM node:16 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Create Docker Compose File

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3'

services:
  backend:
    build: ./backend
    restart: always
    ports:
      - "8000:8000"
    volumes:
      - ./backend/app/data:/app/app/data

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

```

### Run with Docker Compose

```bash
docker-compose up -d
```

## Monitoring and Maintenance

### Checking Service Status

```bash
sudo systemctl status nonogram-api
sudo systemctl status nginx
sudo systemctl status cloudflared  # If using Cloudflare Tunnel
```

### Viewing Logs

```bash
sudo journalctl -u nonogram-api -f
sudo journalctl -u nginx -f
sudo journalctl -u cloudflared -f  # If using Cloudflare Tunnel
```

### Backup and Restore

Regularly backup your data files:

```bash
# Backup
cp -r /home/pi/nonograms-repo/backend/app/data/nonogram-games.json /backup/nonogram-data-$(date +%Y%m%d).json

# Restore
cp /backup/nonogram-data-20250505.json /home/pi/nonograms-repo/backend/app/data/nonogram-games.json
```

## Troubleshooting

### API Not Accessible

1. Check if the API service is running:
   ```bash
   sudo systemctl status nonogram-api
   ```

2. Check the API logs:
   ```bash
   sudo journalctl -u nonogram-api -f
   ```

3. Verify that the API is listening on the expected port:
   ```bash
   ss -tunlp | grep 8000
   ```

### Frontend Not Loading

1. Check Nginx status:
   ```bash
   sudo systemctl status nginx
   ```

2. Check Nginx logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. Verify that the frontend was built correctly:
   ```bash
   ls -la /home/pi/nonograms-repo/frontend/build
   ```

### Cloudflare Tunnel Issues

1. Check the cloudflared service:
   ```bash
   sudo systemctl status cloudflared
   ```

2. Check the cloudflared logs:
   ```bash
   sudo journalctl -u cloudflared -f
   ```

3. Verify your tunnel configuration:
   ```bash
   cat ~/.cloudflared/config.yml
   ```

## Security Considerations

1. Enable HTTPS using Cloudflare or Let's Encrypt
2. Restrict access to your Raspberry Pi using a firewall:
   ```bash
   sudo apt install ufw
   sudo ufw allow SSH
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
3. Keep your system updated:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
4. Consider setting up fail2ban to protect against brute force attacks:
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

## Conclusion

You have now deployed the Nonogram SPA Editor application. The application should be accessible via your configured domain or locally at the specified IP address. Remember to regularly update your system and back up your data for optimal security and reliability. 