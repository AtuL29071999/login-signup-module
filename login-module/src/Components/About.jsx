import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="bg-green-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold">About Us</h1>
          <p className="mt-4 text-lg md:text-xl">
            Learn more about our journey, values, and the people behind the vision.
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Who We Are
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          We are a team of passionate individuals dedicated to delivering exceptional solutions for our customers. 
          Since our inception, we've aimed to innovate and create meaningful impacts in the industry.
        </p>
        <img
          src="https://via.placeholder.com/800x400"
          alt="About us"
          className="rounded-lg shadow-lg mx-auto"
        />
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Team Member */}
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold">John Doe</h3>
              <p className="text-gray-600">CEO & Founder</p>
            </div>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold">Jane Smith</h3>
              <p className="text-gray-600">Chief Technology Officer</p>
            </div>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold">Emily Davis</h3>
              <p className="text-gray-600">Marketing Head</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="mb-6">
            Want to collaborate with us or learn more about what we do? Get in touch today!
          </p>
          <button className="px-6 py-3 bg-green-600 font-semibold rounded-lg shadow-md hover:bg-green-700">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
