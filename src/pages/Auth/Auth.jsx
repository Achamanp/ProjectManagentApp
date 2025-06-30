import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import "./Auth.css"
import Login from './Login'
import Signup from './Signup'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'

const Auth = () => {
    const [activeView, setActiveView] = useState('login'); // 'login', 'signup', 'forgot', 'reset'
    const [isTransitioning, setIsTransitioning] = useState(false);
    const location = useLocation();
    
    // Check if URL contains reset token to show reset password view
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        
        if (token) {
            setActiveView('reset');
        }
    }, [location]);
    
    const handleViewChange = (view) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveView(view);
            setIsTransitioning(false);
        }, 150);
    };

    const handleResetSuccess = () => {
        // After successful password reset, show login
        handleViewChange('login');
    };

    const renderCurrentView = () => {
        if (isTransitioning) {
            return (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
            );
        }

        switch(activeView) {
            case 'signup':
                return <Signup />;
            case 'forgot':
                return <ForgotPassword onBack={() => handleViewChange('login')} />;
            case 'reset':
                return (
                    <ResetPassword 
                        onBack={() => handleViewChange('login')} 
                        onSuccess={handleResetSuccess}
                    />
                );
            case 'login':
            default:
                return <Login onForgotPassword={() => handleViewChange('forgot')} />;
        }
    };

    const renderFooter = () => {
        // Don't show footer for forgot password and reset password views
        if (activeView === 'forgot' || activeView === 'reset') {
            return null;
        }

        return (
            <div className="footer-container">
                <div className="footer-links">
                    <span className="footer-text">
                        {activeView === 'signup' ? "Already have an account?" : "Don't have an account?"}
                    </span>
                    <Button 
                        variant="ghost" 
                        onClick={() => handleViewChange(activeView === 'signup' ? 'login' : 'signup')}
                        className="footer-link"
                    >
                        {activeView === 'signup' ? "Sign In" : "Sign Up"}
                    </Button>
                </div>
            </div>
        );
    };

    // Dynamic sizing based on active view with smooth transitions
    const getBoxClasses = () => {
        const baseClasses = "box transition-all duration-500 ease-out";
        
        switch(activeView) {
            case 'forgot':
                return `${baseClasses} min-h-[420px] w-full max-w-[420px]`;
            case 'reset':
                return `${baseClasses} min-h-[480px] w-full max-w-[440px]`;
            case 'signup':
                return `${baseClasses} min-h-[550px] w-full max-w-[450px]`;
            case 'login':
            default:
                return `${baseClasses} min-h-[480px] w-full max-w-[420px]`;
        }
    };

    // Add view title for better UX
    const getViewTitle = () => {
        switch(activeView) {
            case 'signup':
                return { title: "Create Account", subtitle: "Join our community today" };
            case 'forgot':
                return { title: "Reset Password", subtitle: "We'll send you a reset link" };
            case 'reset':
                return { title: "New Password", subtitle: "Enter your new password" };
            case 'login':
            default:
                return { title: "Welcome Back", subtitle: "Sign in to your account" };
        }
    };
    
    return (
        <div className='loginContainer'>
            {/* Background particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-purple-500/30 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <div className={getBoxClasses()}>
                <div className='login'>
                    <div className='loginBox'>
                        {/* Dynamic header with better styling */}
                        <div className="text-center">
                            <h1 className="form-title">
                                {getViewTitle().title}
                            </h1>
                            <p className="form-subtitle">
                                {getViewTitle().subtitle}
                            </p>
                        </div>
                        
                        {/* Main content with fade transition */}
                        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
                            {renderCurrentView()}
                        </div>
                        
                        {renderFooter()}
                    </div>
                </div>
            </div>

            {/* Floating security indicator */}
            <div className="security-indicator">
                <div className="security-dot"></div>
            </div>
        </div>
    )
}

export default Auth