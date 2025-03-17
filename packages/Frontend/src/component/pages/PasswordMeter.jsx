import React from 'react';
import {assets} from '../../assets/assets'; 

const PasswordCriteria = ({ password }) => {
    const criteria = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains uppercase letter", met: /.*[A-Z].*/.test(password) },
        { label: "Contains lowercase letter", met: /.*[a-z].*/.test(password) },
        { label: "Contains a number", met: /.*\d.*/.test(password) },
        { label: "Contains a special character", met: /.*[!@#$%^&*(),.?":{}|<>].*/.test(password) },
    ];

    return (
        <div>
            {criteria.map((item) => (
                <div key={item.label} className='d-flex align-items-center gap-1 fs-6 my-1'>
                    <img 
                        src={item.met ? assets.check_icon : assets.x} 
                        alt={item.met ? "Met" : "Not met"} 
                        style={{ width: '18px' }}
                    />
                    <span className={item.met ? 'text-success' : 'text-danger'}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const PasswordStrengthMeter = ({ password }) => {
    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/.*[A-Z].*/.test(pass) && /.*[a-z].*/.test(pass)) strength++;
        if (/\d/.test(pass)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;
        return strength;
    };

    const strength = getStrength(password);

    const getColor = (strength) => {
        if (strength === 0) return "bg-danger";
        if (strength === 1) return "bg-warning";
        if (strength === 2) return "bg-info";
        if (strength === 3) return "bg-primary";
        return "bg-success";
    };

    const getStrengthText = (strength) => {
        if (strength === 0) return "Very Weak";
        if (strength === 1) return "Weak";
        if (strength === 2) return "Fair";
        if (strength === 3) return "Good";
        return "Strong";
    };

    return (
        <div className='mt-2'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <span className='fs-6 text-secondary'>Password Strength</span>
                <span className='fs-6 text-secondary'>{getStrengthText(strength)}</span>
            </div>
            <div className='d-flex gap-1 mb-3'>
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`flex-grow-1 ${index < strength ? getColor(strength) : 'bg-light'} rounded-pill`}
                        style={{ height: '6px' }}
                    />
                ))}
            </div>
            <PasswordCriteria password={password} />
        </div>
    );
};

export default PasswordStrengthMeter;