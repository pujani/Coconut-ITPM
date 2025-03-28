import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import logo from "../image/coconutlogo.png";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin 
} from "react-icons/fa";

export default function FooterCom() {
  return (
    <Footer container className="bg-gradient-to-r from-green-50 to-teal-50 border-t-4 border-green-600">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          {/* Logo and Description */}
          <div className="mb-4 sm:mb-0">
            <Link 
              to="/" 
              className="flex items-center space-x-3"
            >
              <img 
                src={logo} 
                alt="Coconut GuardSL Logo" 
                className="h-16 w-16" 
              />
              <span className="self-center whitespace-nowrap text-xl font-semibold text-green-800">
                Coconut GuardSL
              </span>
            </Link>
            <p className="text-sm text-gray-600 mt-2 max-w-xs">
              Empowering health management through innovative technology and comprehensive care.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" className="text-green-800" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Our Mission</Footer.Link>
                <Footer.Link href="#">Team</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Services" className="text-green-800" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Appointments</Footer.Link>
                <Footer.Link href="#">Disease Detection</Footer.Link>
                <Footer.Link href="#">Consultation</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Contact" className="text-green-800" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Support</Footer.Link>
                <Footer.Link href="#">Email</Footer.Link>
                <Footer.Link href="#">Phone</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright 
            href="#" 
            by="Coconut GuardSL" 
            year={new Date().getFullYear()} 
            className="text-gray-600"
          />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={FaFacebook} />
            <Footer.Icon href="#" icon={FaTwitter} />
            <Footer.Icon href="#" icon={FaInstagram} />
            <Footer.Icon href="#" icon={FaLinkedin} />
          </div>
        </div>
      </div>
    </Footer>
  );
}