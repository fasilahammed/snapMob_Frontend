import React, { useState } from 'react';
import { FiSmartphone, FiDollarSign, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function FeatureCards() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
   const navigate = useNavigate();
  const features = [
    {
      icon: <FiSmartphone size={32} />,
      title: "Latest Models",
      desc: "Get the newest smartphones before they hit stores",
      stats: "100+ new models monthly",
      color: "text-blue-500"
    },
    {
      icon: <FiDollarSign size={32} />,
      title: "Best Prices",
      desc: "Price match guarantee on all devices",
      stats: "30-day price protection",
      color: "text-green-500"
    },
    {
      icon: <FiTruck size={32} />,
      title: "Fast Delivery",
      desc: "Free shipping on orders over $299",
      stats: "Same-day dispatch",
      color: "text-orange-500"
    },
    {
      icon: <FiShield size={32} />,
      title: "2-Year Warranty",
      desc: "Extended warranty on all purchases",
      stats: "Free replacements",
      color: "text-purple-500"
    },
    {
      icon: <FiRefreshCw size={32} />,
      title: "Easy Returns",
      desc: "30-day no-questions-asked returns",
      stats: "98% satisfaction rate",
      color: "text-red-500"
    },
    {
      icon: <FiHeadphones size={32} />,
      title: "24/7 Support",
      desc: "Dedicated customer service team",
      stats: "Instant chat response",
      color: "text-cyan-500"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose SnapMob?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're revolutionizing smartphone shopping with premium services and customer-first policies
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className={`border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-orange-200 transition-all duration-300 ${hoveredIndex === index ? 'transform scale-105 shadow-xl' : 'shadow-md'}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 mb-3 text-sm leading-relaxed">{feature.desc}</p>
              <p className="text-sm text-gray-500 font-bold">{feature.stats}</p>
              
              {hoveredIndex === index && (
                <div className="mt-4 pt-4 border-t-2 border-gray-100">
                  <button className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors duration-300">
                    Learn more →
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => navigate("/products")} 
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl hover:scale-105"
          >
            Explore All Benefits
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}