const Contact = () => {
  return (
    <div className="w-full h-screen lg:py-12 py-12 flex items-center justify-center bg-gradient-to-r from-gray-900 to-black">
      <div className="lg:w-3/5 w-full mx-auto text-center">
        <div className="flex flex-col md:flex-row bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
          <div
            className="flex-1 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://www.example.com/cyber-image1.jpg')",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-60 text-white py-12 px-8">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 text-shadow">
                We&apos;d Love to Hear From You
              </h2>
              <p className="text-lg lg:text-xl mb-6 text-shadow">
                Get in touch with us for any queries or feedback!
              </p>
            </div>
          </div>

          <div className="flex-1 bg-gray-900 p-8 shadow-lg rounded-xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-teal-400 mb-6">
              Connect with Us
            </h2>
            <form
              action="https://formspree.io/f/xyyavpwr"
              method="post"
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="bg-gray-700 w-full p-3 border-2 border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-300"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className="bg-gray-700 w-full p-3 border-2 border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-300"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="bg-gray-700 w-full p-3 border-2 border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-300"
                required
              />
              <textarea
                name="message"
                rows="4"
                placeholder="Message"
                className="bg-gray-700 w-full p-3 border-2 border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-300"
                required
              />
              <div className="flex justify-center">
                <button className="bg-teal-800 text-white px-6 py-2 font-bold rounded-2xl hover:bg-teal-700 transition duration-300 shadow-lg">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
