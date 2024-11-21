import React, { useState } from "react";
import {
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFooter = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <footer
      className={`fixed bottom-0 left-0 w-full bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        isExpanded ? "h-64" : "h-28"
      }`}
    >
      <div className="relative w-full max-w-screen-xl mx-auto sm:px-6 lg:px-8">
        <div
          className="absolute top-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-gray-700 rounded-full p-2"
          onClick={toggleFooter}
          title={isExpanded ? "Collapse Footer" : "Expand Footer"}
        >
          {isExpanded ? (
            <FaChevronDown className="text-gray-400 text-xl" />
          ) : (
            <FaChevronUp className="text-gray-400 text-xl" />
          )}
        </div>

        {/* Top Section (Social Media Links) */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">Stay Connected</h3>
            <p className="text-gray-400 mt-2">
              Follow us on social media or reach out for collaborations!
            </p>
          </div>
          <div className="flex space-x-6 text-3xl">
            <a
              href="https://www.youtube.com/@codeworshipper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400 transition"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
            <a
              href="https://www.instagram.com/synchhans"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 transition"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/+6283804506486"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400 transition"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Bottom Section (Collapsed Content) */}
        <div
          className={`overflow-hidden transition-opacity duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-center mt-4">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Muhamad Farhan. All rights
              reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <a
                href="/privacy-policy"
                className="text-blue-400 hover:underline"
              >
                Privacy Policy
              </a>{" "}
              |{" "}
              <a
                href="/terms-of-service"
                className="text-blue-400 hover:underline"
              >
                Terms of Service
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Contact me at{" "}
              <a
                href="mailto:muhamadfarhan.inc@gmail.com"
                className="text-blue-400 hover:underline"
              >
                muhamadfarhan.inc@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
