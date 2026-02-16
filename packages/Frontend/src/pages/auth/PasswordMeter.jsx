import { assets } from "../../assets/assets";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /.*[A-Z].*/.test(password) },
    { label: "Contains lowercase letter", met: /.*[a-z].*/.test(password) },
    { label: "Contains a number", met: /.*\d.*/.test(password) },
    {
      label: "Contains a special character",
      met: /.*[!@#$%^&*(),.?":{}|<>].*/.test(password),
    },
  ];

  return (
    <div>
      {criteria.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 text-sm font-normal my-1"
        >
          <img
            src={item.met ? assets.check_icon : assets.x}
            alt={item.met ? "Met" : "Not met"}
            className="w-[10px] mt-1"
          />
          <span className={item.met ? "text-green-600" : "text-red-600"}>
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
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;
    return strength;
  };

  const strength = getStrength(password);

  const getColor = (level) => {
    if (level === 0) return "bg-red-500";
    if (level === 1) return "bg-yellow-400";
    if (level === 2) return "bg-blue-400";
    if (level === 3) return "bg-blue-600";
    return "bg-green-500";
  };

  const getStrengthText = (level) => {
    if (level === 0) return "Very Weak";
    if (level === 1) return "Weak";
    if (level === 2) return "Fair";
    if (level === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Password Strength</span>
        <span className="text-sm text-gray-600">
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="flex gap-1 mb-3">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`flex-grow h-1.5 rounded-full ${
              index < strength ? getColor(strength) : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
