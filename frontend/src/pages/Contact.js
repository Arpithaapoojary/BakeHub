export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-24 px-6 pb-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-6">
        Contact Us
      </h1>

      <p className="text-gray-700 text-lg max-w-2xl mx-auto text-center mb-12">
        Have questions, feedback, or partnership ideas? We'd love to hear from
        you!
      </p>

      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Message
            </label>
            <textarea
              rows="5"
              placeholder="Write your message..."
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-medium text-lg shadow"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
