import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const AccountDropdown = ({userRole}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    navigate("/"); // Redirect to Home page
    setDropdownOpen(false);
  };

  const handleUpdatePassword = () => {
    console.log('Update password clicked');
    navigate("/update-password", { state: { userRole } });
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center justify-between bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Account
        </div>
        <svg 
          className={`ml-2 h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {dropdownOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in"
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <ul className="py-1">
            <li className="hover:bg-blue-50 transition-colors duration-150">
              <button
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 focus:outline-none"
                onClick={handleUpdatePassword}
              >
                <div className="flex items-center cursor-pointer">
                  <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="group-hover:text-blue-600 transition-colors">Update Password</span>
                </div>
              </button>
            </li>
            
            {/* <li className="hover:bg-blue-50 transition-colors duration-150">
              <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 focus:outline-none">
                <div className="flex items-center cursor-pointer">
                  <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="group-hover:text-purple-600 transition-colors">Settings</span>
                </div>
              </button>
            </li> */}
            
            {/* <li className="hover:bg-blue-50 transition-colors duration-150">
              <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 focus:outline-none">
                <div className="flex items-center cursor-pointer">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="group-hover:text-green-600 transition-colors">Help & Support</span>
                </div>
              </button>
            </li> */}
            
            <div className="border-t border-gray-100"></div>
            
            <li className="hover:bg-red-50 transition-colors duration-150">
              <button
                className="block w-full text-left px-4 py-3 text-sm focus:outline-none"
                onClick={handleLogout}
              >
                <div className="flex items-center cursor-pointer">
                  <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-red-600 group-hover:text-red-700 transition-colors">Logout</span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;