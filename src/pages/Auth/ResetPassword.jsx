import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, CheckCircledIcon, EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import { resetPassword } from '../../Redux/Auth/Action' // Adjust path as needed

const ResetPassword = ({ onBack, onSuccess }) => {
    const [formData, setFormData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    
    const { 
        resetPasswordLoading, 
        resetPasswordSuccess, 
        resetPasswordError 
    } = useSelector(state => state.auth);

    // Extract token from URL params or props
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            // If no token in UR
        }
    }, [location]);

    // Clear errors when user types
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setErrors({});
        }
    }, [formData]);

    // Handle successful password reset
    useEffect(() => {
        if (resetPasswordSuccess) {
            // Clear form
            setFormData({
                otp: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            // Call success callback if provided, or navigate to login after delay
            if (onSuccess) {
                onSuccess();
            } else {
                setTimeout(() => {
                    navigate('/auth'); // Navigate to login page
                }, 2000);
            }
        }
    }, [resetPasswordSuccess, onSuccess, navigate]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.otp.trim()) {
            newErrors.otp = 'OTP is required';
        } else if (!/^\d{4}$/.test(formData.otp.trim())) {
            newErrors.otp = 'OTP must be 4 digits';
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters long';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!token) {
            newErrors.token = 'Reset token is missing';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Dispatch Redux action
        dispatch(resetPassword({
            token: token,
            otp: formData.otp.trim(),
            newPassword: formData.newPassword
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBackToLogin = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/auth');
        }
    };

    // Show success screen
    if (resetPasswordSuccess) {
        return (
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <CheckCircledIcon className="w-16 h-16 text-green-500" />
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Password Reset Successful!</h2>
                    <p className="text-gray-600">
                        Your password has been successfully updated.
                    </p>
                    <p className="text-gray-600">
                        You can now login with your new password.
                    </p>
                </div>

                <Button 
                    onClick={handleBackToLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    Continue to Login
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-blue-500">Reset Your Password</h2>
                <p className="text-gray-200">
                    Enter the OTP sent to your email and your new password.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* OTP Input */}
                <div className="space-y-2">
                    
                    <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 4-digit OTP"
                        value={formData.otp}
                        onChange={(e) => handleInputChange('otp', e.target.value)}
                        className="w-full"
                        disabled={resetPasswordLoading}
                        maxLength={4}
                    />
                    {errors.otp && (
                        <p className="text-red-500 text-sm">{errors.otp}</p>
                    )}
                </div>

                {/* New Password Input */}
                <div className="space-y-2">
                    
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            className="w-full pr-10"
                            disabled={resetPasswordLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm">{errors.newPassword}</p>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                    
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="w-full pr-10"
                            disabled={resetPasswordLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Token Error */}
                {errors.token && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">{errors.token}</p>
                    </div>
                )}

                {/* Redux Error */}
                {resetPasswordError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">{resetPasswordError}</p>
                    </div>
                )}

                <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={resetPasswordLoading}
                >
                    {resetPasswordLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
            </form>

            <div className="text-center">
                <Button 
                    onClick={handleBackToLogin}
                    variant="ghost"
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Login
                </Button>
            </div>
        </div>
    );
};

export default ResetPassword;