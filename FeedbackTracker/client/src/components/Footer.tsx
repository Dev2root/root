const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} Feedback System. All rights reserved.</p>
          </div>
          <div>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-sm text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
