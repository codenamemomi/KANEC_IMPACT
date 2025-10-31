# KANEC IMPACT

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A blockchain-powered platform for transparent, verified donations to African impact projects using Hedera's distributed ledger technology. Every donation is recorded on-chain, ensuring complete transparency and eliminating corruption in charitable giving.

## 🌟 Overview

KANEC IMPACT revolutionizes charitable giving by leveraging blockchain technology to create an immutable, transparent record of all donations. Built on Hedera's high-performance distributed ledger, the platform enables donors to track their contributions in real-time while ensuring funds reach verified African impact projects without intermediaries.

### Key Highlights
- **100% Transparency**: Every transaction is recorded on Hedera's public ledger
- **Blockchain Verified**: Smart contracts ensure funds go exactly where promised
- **Real-Time Tracking**: Donors can monitor their impact in real-time
- **Secure & Trustless**: No intermediaries, no corruption
- **Instant Settlement**: Hedera's 3-5 second finality ensures fast transactions

## ✨ Features

### 🔐 User Management
- Secure user authentication and authorization
- Hedera wallet creation and management
- Encrypted private key storage
- Email verification and OTP systems

### 💰 Donation System
- Blockchain-powered donations using HBAR
- Real-time transaction verification
- Project escrow accounts
- Donation history and tracking

### 📊 Project Management
- Verified project submissions
- Impact tracking and reporting
- Community engagement features
- Project milestone monitoring

### 🔄 P2P Transfers
- Direct wallet-to-wallet transfers
- Transaction memos and metadata
- Real-time balance updates

### 📈 Analytics & Insights
- Donation analytics and reporting
- Project performance metrics
- AI-powered insights (planned)
- Real-time dashboard

### 🔍 Transaction Tracing
- Complete transaction audit trail
- Mirror node integration for verification
- Transaction history and details

## 🛠 Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache**: Redis
- **Task Queue**: Celery
- **Blockchain**: Hedera SDK (hiero-sdk-python)
- **Authentication**: JWT tokens
- **Email**: Brevo (SendGrid) API
- **Validation**: Pydantic

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: CSS Modules + Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Database Migrations**: Alembic
- **Testing**: pytest
- **Code Quality**: ESLint, Pre-commit hooks
- **API Documentation**: FastAPI auto-generated docs

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Python 3.9+**
- **Node.js 18+**
- **PostgreSQL 13+**
- **Redis 6+**
- **Docker & Docker Compose**
- **Hedera Testnet/Mainnet Account** (for blockchain operations)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/codenamemomi/KANEC_IMPACT
cd KANEC_IMPACT
```

### 2. Backend Setup

#### Using Docker (Recommended)
```bash
cd KANEC_BACKEND
cp .env.example .env  # Configure your environment variables
docker-compose up -d
```

#### Manual Setup
```bash
cd KANEC_BACKEND

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd KANEC_FRONTEND

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Environment Configuration

Create `.env` files in both backend and frontend directories:

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=kanec_db

# Security
SECRET_KEY=your-secret-key-here
PRIVATE_KEY_ENCRYPTION_KEY=your-encryption-key

# Hedera
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=your-hedera-account-id
HEDERA_OPERATOR_KEY=your-hedera-private-key

# Email (Brevo/SendGrid)
BREVO_API_KEY=your-brevo-api-key
MAIL_FROM=your-email@example.com

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Other
VERIFICATION_BASE_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/kanec
VITE_HEDERA_NETWORK=testnet
```

## 📖 Usage

### Starting the Application

1. **Backend**: The FastAPI server will be available at `http://localhost:8000`
2. **Frontend**: The React app will be available at `http://localhost:5173`
3. **API Documentation**: Visit `http://localhost:8000/docs` for interactive API docs

### Key Workflows

#### User Registration
1. User signs up with email and password
2. Email verification sent via Brevo
3. Hedera wallet automatically created and encrypted
4. User can start donating immediately

#### Project Creation
1. Verified organizations submit projects
2. Projects are reviewed and approved
3. Hedera escrow wallet created for each project
4. Projects become available for donations

#### Making Donations
1. User selects project and donation amount
2. Transaction signed with user's Hedera wallet
3. Funds transferred instantly via Hedera network
4. Transaction verified and recorded in database

## 📚 API Documentation

The API is organized into several modules:

### Authentication (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify-email` - Email verification
- `POST /forgot-password` - Password reset

### Projects (`/api/v1/projects`)
- `GET /` - List all projects
- `POST /` - Create new project (organizations only)
- `GET /{project_id}` - Get project details
- `PUT /{project_id}` - Update project
- `DELETE /{project_id}` - Delete project

### Donations (`/api/v1/donations`)
- `POST /` - Make a donation
- `GET /` - Get user's donation history
- `GET /{donation_id}` - Get donation details

### Analytics (`/api/v1/analytics`)
- `GET /dashboard` - Dashboard statistics
- `GET /projects/{project_id}` - Project analytics
- `GET /donations/trends` - Donation trends

### Transaction Tracing (`/api/v1/trace`)
- `GET /{transaction_hash}` - Trace transaction details
- `GET /verify/{transaction_hash}` - Verify transaction on Hedera

### P2P Transfers (`/api/v1/p2p`)
- `POST /transfer` - Transfer HBAR between users
- `GET /history` - Transfer history

## 🗄 Database Models

### Core Models
- **User**: User accounts with Hedera wallet integration
- **Organization**: Verified organizations that create projects
- **Project**: Impact projects with escrow wallets
- **Donation**: Donation records with blockchain transaction hashes

### Supporting Models
- **ActivityLog**: User activity tracking
- **Notification**: User notifications
- **EmailTemplate**: Customizable email templates
- **Settings**: Application configuration

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd KANEC_BACKEND
pytest

# Frontend tests
cd KANEC_FRONTEND
npm test
```

### Code Quality
```bash
# Backend linting
cd KANEC_BACKEND
pylint api/
black api/

# Frontend linting
cd KANEC_FRONTEND
npm run lint
```

### Database Migrations
```bash
cd KANEC_BACKEND
alembic revision --autogenerate -m "Migration message"
alembic upgrade head
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript/React
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hedera**: For providing the blockchain infrastructure
- **FastAPI**: For the excellent Python web framework
- **React**: For the powerful frontend library
- **The Open Source Community**: For the amazing tools and libraries

## 📞 Support

For support, email support@kanecimpact.com or join our Discord community.

---

**Built with ❤️ for transparent giving and lasting impact in Africa**
