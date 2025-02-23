import { FaFacebookF, FaDiscord, FaTwitter, FaGithub, FaDribbble } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-emerald-600 py-6 text-center text-gray-700">
      <hr className="border-gray-400 mb-4 mx-20" />
      <div className="flex flex-col items-center space-y-2">
        <p className="text-sm ">&copy; 2025 Enigma™. All Rights Reserved.</p>
        <p className="text-sm flex items-center">
          Made with <span className="text-red-500 mx-1">❤️</span> by Team Enigma
        </p>
        <div className="flex space-x-4 mt-2">
          <FaFacebookF className="text-gray-700 hover:text-gray-900 cursor-pointer" />
          <FaDiscord className="text-gray-700 hover:text-gray-900 cursor-pointer" />
          <FaTwitter className="text-gray-700 hover:text-gray-900 cursor-pointer" />
          <FaGithub className="text-gray-700 hover:text-gray-900 cursor-pointer" />
          <FaDribbble className="text-gray-700 hover:text-gray-900 cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;