import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500 flex-shrink-0">
      <p>&copy; {new Date().getFullYear()} Eglise-Tech. Tous droits réservés.</p>
    </footer>
  );
};

export default Footer;
