# eBURG: Online Ordering System with POS and Inventory

A comprehensive Point of Sale (POS) and inventory management system designed specifically for Minute Burger Sta. Ana, developed using React Native with Expo and TypeScript.

## 📱 Project Overview

eBURG is a digital solution that replaces manual processes in fast-food operations, providing real-time order processing, inventory management, and sales reporting. The system features dual panels for different user roles and operates both online and offline.

### 🎯 Key Features

- **Dual-Panel Architecture**: Separate interfaces for Cashiers and Managers
- **Real-time Inventory Tracking**: Automatic stock deduction with low-stock alerts
- **Offline Functionality**: Core features work without internet connection
- **Digital Receipt System**: Paperless transaction records
- **Comprehensive Reporting**: Daily, weekly, and monthly sales analytics
- **Role-based Access Control**: Secure authentication system

## 🏗️ System Architecture

### Technology Stack

**Frontend:**
- React Native with Expo
- TypeScript
- HTML/CSS/JavaScript (Web components)

**Backend:**
- PHP (Server-side processing)
- MySQL (Database)

**Development Tools:**
- Visual Studio Code
- GitHub (Version Control)
- Figma (UI/UX Design)
- Canva (Visual Assets)

## 📋 Requirements

### Software Requirements
- **Mobile**: Android 9.0 or higher
- **Desktop**: Windows 10 (64-bit) or higher
- **Browser**: Google Chrome or Microsoft Edge
- **Mobile App**: Expo Go App

### Hardware Requirements

**For Tablet-Based POS:**
- CPU: Quad-Core ARM (Snapdragon 400 series or better)
- RAM: 8 GB minimum
- Storage: 16 GB internal
- Display: 7" touchscreen minimum
- Connectivity: Wi-Fi (802.11n), Bluetooth 4.0

**For Computer-Based POS:**
- Processor: 1.8 GHz Dual-Core
- RAM: 8 GB minimum
- Storage: 500 GB HDD or SSD
- Display: 1024 x 600 resolution
- Connectivity: Ethernet or Wi-Fi

## 🚀 Installation & Setup

### Prerequisites
```bash
# Install Node.js (v16 or higher)
# Install Expo CLI
npm install -g expo-cli

# Install dependencies
npm install
```

### Getting Started
```bash
# Clone the repository
git clone https://github.com/your-username/eburg-pos-system.git
cd eburg-pos-system

# Install dependencies
npm install

# Start the development server
expo start
```

### Database Setup
1. Create MySQL database
2. Import the provided schema
3. Configure database connection in config files
4. Run initial data migration

## 👥 User Roles & Access

### Cashier Panel
**Capabilities:**
- Process customer orders
- Add/remove items from cart
- Generate digital receipts
- View order status
- Access order history
- Search and filter products

**Login Requirements:**
- Assigned username and password
- Basic device operation knowledge
- Understanding of POS workflow

### Manager Panel
**Capabilities:**
- View sales dashboard
- Manage products and categories
- Monitor inventory levels
- Generate reports (daily/weekly/monthly)
- Manage user accounts
- View system activity logs
- Handle order modifications/cancellations

**Login Requirements:**
- Manager-level credentials
- Advanced system permissions
- Reporting and analytics access

## 📊 Core Modules

### 1. Order Management
- Digital cart system
- Real-time order processing
- Status tracking (pending, preparing, completed)
- Order modification and cancellation

### 2. Inventory System
- Automatic stock deduction
- Low-stock alerts
- Real-time inventory updates
- Product category management

### 3. Reporting & Analytics
- Sales performance tracking
- Top-selling items analysis
- Daily/weekly/monthly reports
- Export functionality (PDF/Excel)

### 4. User Authentication
- Role-based access control
- Secure login system
- Activity logging
- Password protection

## 🗄️ Database Schema

### Core Tables
- **Customer**: Customer information and profiles
- **Product**: Menu items with pricing and categories
- **Orders**: Transaction records and order details
- **OrderProduct**: Junction table for order items
- **Payment**: Payment processing and methods
- **Inventory**: Stock levels and product tracking
- **Admin**: System administrator accounts

### Key Relationships
- Customer → Orders (One-to-Many)
- Orders → OrderProduct (One-to-Many)
- Product → OrderProduct (One-to-Many)
- Product → Inventory (One-to-One)
- Admin → Inventory (One-to-Many)

## 🔧 Configuration

### Environment Variables
```typescript
// config/environment.ts
export const config = {
  API_BASE_URL: 'your-api-endpoint',
  DATABASE_URL: 'your-database-connection',
  JWT_SECRET: 'your-jwt-secret',
  OFFLINE_STORAGE_KEY: 'eburg_offline_data'
};
```

### Offline Configuration
The system supports offline mode for critical operations:
- Order processing
- Inventory checking
- Basic reporting
- Data synchronization when connection restored

## 📱 Mobile App Features

### Responsive Design
- Optimized for 7"+ tablets
- Touch-friendly interface
- Portrait and landscape orientation
- Gesture-based navigation

### Performance Optimization
- Lazy loading for large product catalogs
- Efficient state management
- Minimal memory footprint
- Fast startup times

## 🛡️ Security Features

- **Authentication**: JWT-based login system
- **Authorization**: Role-based access control
- **Data Protection**: Encrypted sensitive information
- **Activity Logging**: Audit trail for all actions
- **Input Validation**: Protection against malicious input

## 📈 Business Benefits

### Operational Improvements
- **Speed**: Faster transaction processing
- **Accuracy**: Reduced manual errors
- **Efficiency**: Streamlined workflows
- **Visibility**: Real-time business insights

### Risk Mitigation
- **Data Protection**: Digital backup prevents document loss
- **Error Reduction**: Automated calculations and tracking
- **Accountability**: Comprehensive activity logging
- **Consistency**: Standardized processes across shifts

## 🔄 System Workflow

### Customer Order Process
1. Cashier logs into system
2. Selects products from digital menu
3. Adds items to cart with quantities
4. Reviews order summary
5. Processes payment
6. Generates digital receipt
7. Updates inventory automatically

### Manager Operations
1. Access dashboard with sales overview
2. Monitor real-time order activity
3. Check inventory levels and alerts
4. Generate performance reports
5. Manage products and pricing
6. Review system activity logs

## 📋 Future Enhancements

### Planned Features
- **Mobile Payments**: Integration with digital wallets
- **QR Code Ordering**: Customer self-service options
- **Loyalty Program**: Customer reward system
- **Multi-branch Support**: Centralized management
- **Advanced Analytics**: Predictive inventory management

### Scalability Considerations
- Cloud deployment options
- Multi-tenant architecture
- API integration capabilities
- Third-party service compatibility

## 👨‍💻 Development Team

**CXML Group 1 - BSIT 2nd Year B**
- **Catherine C. Arnado** (Leader) - ID: 59833432
- **Xander Jyle P. Palma** - ID: 59833942
- **Luis Mario Palicte** - ID: 59833732
- **Melgen A. Simo II** - ID: 59834968

**Institution:** Holy Cross of Davao College

## 📄 License

This project is developed as an academic requirement and is intended for educational purposes and implementation at Minute Burger Sta. Ana.

## 📞 Support

For technical support or questions about the system:
- Contact the development team through your institution
- Refer to user documentation included with the system
- Check the troubleshooting guide for common issues

## 🤝 Contributing

This is an academic project. For contributions or suggestions:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description
4. Follow the existing code style and conventions

---

**Project Status:** Requirements Specification and Conceptual Data Model Phase  
**Last Updated:** May 19, 2025  
**Version:** 1.0.0