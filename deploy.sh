#!/bin/bash

# Quiz App Easy Deployment Script
echo "🚀 Quiz App Easy Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    echo "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ from https://nodejs.org"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    print_status "Node.js and npm are installed"
}

# Install Vercel CLI if not already installed
install_vercel() {
    if ! command -v vercel &> /dev/null; then
        print_info "Installing Vercel CLI..."
        npm install -g vercel
        print_status "Vercel CLI installed"
    else
        print_status "Vercel CLI already installed"
    fi
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_info "Deploying frontend to Vercel..."
    
    cd frontend
    
    # Create .env.production if it doesn't exist
    if [ ! -f .env.production ]; then
        print_warning "Creating .env.production file..."
        echo "Please enter your Railway backend URL (e.g., https://quiz-app-backend-production-xxxx.up.railway.app):"
        read -r backend_url
        echo "REACT_APP_API_URL=$backend_url" > .env.production
        print_status ".env.production created"
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    cd ..
    print_status "Frontend deployed to Vercel!"
}

# Show deployment URLs
show_urls() {
    echo ""
    echo "🎉 Deployment Complete!"
    echo "======================"
    echo ""
    print_info "Your quiz app is now live!"
    echo ""
    print_warning "Next steps:"
    echo "1. Set up MongoDB Atlas database (see EASY_DEPLOYMENT.md)"
    echo "2. Deploy backend to Railway (see EASY_DEPLOYMENT.md)"
    echo "3. Update environment variables"
    echo "4. Test your application"
    echo ""
    print_info "For detailed instructions, see: EASY_DEPLOYMENT.md"
}

# Main deployment process
main() {
    check_requirements
    install_vercel
    
    echo ""
    print_info "This script will help you deploy the frontend to Vercel."
    print_warning "Make sure you have:"
    echo "  • MongoDB Atlas database set up"
    echo "  • Railway backend deployed"
    echo "  • Backend URL ready"
    echo ""
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_frontend
        show_urls
    else
        print_info "Deployment cancelled. Run this script again when ready!"
    fi
}

# Run main function
main