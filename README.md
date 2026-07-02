# Online Bank Transaction Kubernetes

A containerized banking transaction application built with Node.js/JavaScript and deployed on Kubernetes for scalable, reliable financial operations.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Docker Setup](#docker-setup)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## 🏦 Overview

This project implements a secure online banking transaction system with a modern web interface and backend API. The application is containerized using Docker and orchestrated with Kubernetes for high availability and scalability.

## ✨ Features

- **User-friendly Interface**: Clean, responsive web UI built with HTML and CSS
- **Secure Transactions**: Robust backend transaction processing
- **Containerized**: Docker support for consistent deployments
- **Kubernetes Ready**: Production-grade orchestration and scaling
- **RESTful API**: Clean API endpoints for transaction management
- **Scalable Architecture**: Horizontal scaling with Kubernetes

## 🛠️ Technology Stack

- **Backend**: Node.js / JavaScript (55.9%)
- **Frontend**: HTML (25%) / CSS (17.7%)
- **Containerization**: Docker (1.4%)
- **Orchestration**: Kubernetes
- **Database**: [Specify your database - MongoDB, PostgreSQL, MySQL, etc.]
- **Runtime**: Node.js

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **Docker** (v20 or higher)
- **Kubernetes** (v1.20 or higher) or **Minikube** for local development
- **kubectl** command-line tool
- **npm** or **yarn** package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lekhareddy15/online-bank-transaction-kubernetes.git
cd online-bank-transaction-kubernetes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with your configuration:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/banking
API_KEY=your_api_key_here
```

### 4. Run Locally

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
online-bank-transaction-kubernetes/
├── src/
│   ├── index.js           # Application entry point
│   ├── api/               # API endpoints
│   ├── models/            # Database models
│   └── routes/            # Route definitions
├── public/                # Static files (HTML, CSS)
│   ├── index.html
│   ├── css/               # Stylesheets
│   └── js/                # Client-side JavaScript
├── kubernetes/            # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── Dockerfile             # Docker image configuration
├── docker-compose.yml     # Local development setup
├── package.json           # Node.js dependencies
└── README.md             # This file
```

## 🐳 Docker Setup

### Build Docker Image

```bash
docker build -t online-bank-transaction:latest .
```

### Run Docker Container

```bash
docker run -d \
  --name banking-app \
  -p 3000:3000 \
  --env-file .env \
  online-bank-transaction:latest
```

### Docker Compose (for local development)

```bash
docker-compose up -d
```

## ☸️ Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl create namespace banking
```

### 2. Create ConfigMap and Secrets

```bash
kubectl create configmap app-config --from-file=.env -n banking
kubectl create secret generic app-secrets --from-literal=API_KEY=your_key -n banking
```

### 3. Apply Kubernetes Manifests

```bash
kubectl apply -f kubernetes/ -n banking
```

### 4. Verify Deployment

```bash
# Check deployment status
kubectl get deployments -n banking

# Check pods
kubectl get pods -n banking

# Check services
kubectl get services -n banking
```

### 5. Access the Application

```bash
# Port forward to localhost
kubectl port-forward svc/banking-service 3000:3000 -n banking
```

Access at `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `DATABASE_URL` | Database connection string | localhost |
| `API_KEY` | API authentication key | - |
| `LOG_LEVEL` | Logging level | info |

### Kubernetes Resources

- **CPU Request**: 100m
- **CPU Limit**: 500m
- **Memory Request**: 128Mi
- **Memory Limit**: 512Mi
- **Replicas**: 3 (default)

Adjust these in `kubernetes/deployment.yaml` as needed.

## 📖 Usage

### Basic Transaction Flow

1. **User Login**: Authenticate via the web interface
2. **Select Transaction Type**: Choose between transfer, deposit, withdrawal, etc.
3. **Enter Details**: Input transaction information
4. **Review & Confirm**: Verify transaction details
5. **Process**: Submit transaction for processing
6. **Confirmation**: Receive transaction confirmation

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - Register new user

#### Transactions
- `GET /api/transactions` - Fetch transaction history
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get transaction details
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Cancel transaction

#### Accounts
- `GET /api/accounts` - Fetch user accounts
- `GET /api/accounts/:id` - Get account details
- `POST /api/accounts` - Create new account

## 🔒 Security Considerations

- Always use HTTPS in production
- Store secrets in Kubernetes Secrets, not ConfigMaps
- Implement rate limiting for API endpoints
- Use authentication/authorization for all endpoints
- Regularly update dependencies
- Enable network policies in Kubernetes
- Monitor and log all transactions

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## 🔄 CI/CD Pipeline

This project is configured for automated deployment. Push to the main branch triggers:

1. Automated testing
2. Docker image build
3. Container registry push
4. Kubernetes deployment

## 📝 Logs and Monitoring

### View Application Logs

```bash
kubectl logs -f deployment/banking-app -n banking
```

### Monitor Resource Usage

```bash
kubectl top pods -n banking
kubectl top nodes
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support, email: [your-email@example.com] or open an issue on GitHub.

---

**Last Updated**: July 2, 2026

For more information, visit the [GitHub repository](https://github.com/lekhareddy15/online-bank-transaction-kubernetes)
