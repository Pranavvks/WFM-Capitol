import { BellIcon, MenuIcon, SettingsIcon, UserCircleIcon, XIcon } from "lucide-react";
import { Button } from "./button";
import CapitolLogo from "../../app/Logomark.svg"
import Image from "next/image";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#121518] border-b border-gray-700 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Branding */}
          <div className="flex items-center flex-shrink-0 space-x-3">
            <Image 
              src={CapitolLogo} 
              alt="Capitol Insurance"
              className="h-8 w-8"
            />
            <span className="text-white font-semibold text-lg tracking-tight">Capitol Insurance</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-6">
            <a href="/insurance-applications" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors duration-200">
              Insurance Applications
            </a>
            <a href="/claim-applications" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors duration-200">
              Claim Applications
            </a>
          
            <div className="flex items-center space-x-4 ml-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <SettingsIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <BellIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <UserCircleIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden absolute w-full bg-[#121518] border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="/" className="block text-gray-300 hover:text-white px-3 py-2">Dashboard</a>
            <a href="/policies" className="block text-gray-300 hover:text-white px-3 py-2">Policies</a>
            <a href="/claims" className="block text-gray-300 hover:text-white px-3 py-2">Claims</a>
          </div>
        </div>
      )}
    </nav>
  );
};