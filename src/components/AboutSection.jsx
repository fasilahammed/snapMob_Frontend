import React from 'react';
// REMOVED: Framer Motion import
import { FiAward, FiUsers, FiSmartphone, FiShield } from 'react-icons/fi';

// This is a fully static version with all animations removed.
const AboutSection = () => {
  const stats = [
    { icon: <FiAward size={40} />, value: "10+", label: "Years Experience" },
    { icon: <FiUsers size={40} />, value: "50K+", label: "Happy Customers" },
    { icon: <FiSmartphone size={40} />, value: "500+", label: "Premium Devices" },
    { icon: <FiShield size={40} />, value: "100%", label: "Authentic Products" },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column (Image) - Changed from motion.div to div */}
          <div className="relative overflow-hidden">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="About SnapMob" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column (Text Content) - Changed from motion.div to div */}
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Redefining Luxury <span className="text-orange-500">Mobile</span> Experience
            </h2>
            <p className="text-gray-300 mb-8">
              At SnapMob, we curate only the finest smartphones that combine cutting-edge technology with exquisite craftsmanship. 
              Our passion for innovation and commitment to quality has made us the preferred destination for discerning customers 
              who demand nothing but the best.
            </p>
            
             <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="text-orange-500 mb-3">{stat.icon}</div>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-gray-300 text-sm font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-300">
                  Hand-picked selection of premium smartphones from top brands
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-300">
                  Extended 2-year warranty on all devices for complete peace of mind
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-300">
                  Personalized concierge service for VIP customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;