import { Link } from "react-router-dom";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";

const Footer = () => {
  const collections = ["Black teas", "Green teas", "White teas", "Herbal teas", "Matcha", "Chai", "Oolong", "Rooibos", "Teaware"];
  const learn = ["About us", "About our teas", "Tea academy"];
  const service = ["Ordering and payment", "Delivery", "Privacy and policy", "Terms & Conditions"];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Collections */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider text-gray-900 mb-4">COLLECTIONS</h4>
            <ul className="space-y-2">
              {collections.map((item) => (
                <li key={item}>
                  <Link to="/collections" className="text-sm text-gray-600 hover:text-gray-900 no-underline transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider text-gray-900 mb-4">LEARN</h4>
            <ul className="space-y-2">
              {learn.map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider text-gray-900 mb-4">CUSTOMER SERVICE</h4>
            <ul className="space-y-2">
              {service.map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider text-gray-900 mb-4">CONTACT US</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <FiMapPin size={14} className="mt-0.5 text-gray-500 shrink-0" />
                <span className="text-sm text-gray-600">3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Province, Iran</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail size={14} className="text-gray-500 shrink-0" />
                <span className="text-sm text-gray-600">Email: amoopur@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone size={14} className="text-gray-500 shrink-0" />
                <span className="text-sm text-gray-600">Tel: +98 9173038406</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
