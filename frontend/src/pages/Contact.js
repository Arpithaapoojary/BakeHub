export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-24 px-6 pb-20">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-pink-600 mb-6">
        Contact Us
      </h1>

      <p className="text-gray-600 text-lg max-w-2xl mx-auto text-center leading-relaxed mb-12">
        Have questions, feedback, or partnership ideas? We'd love to hear from
        you.
      </p>

      {/* Form Box */}
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-md border border-pink-100">
        <form className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 border border-pink-200 rounded-xl bg-white focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-pink-200 rounded-xl bg-white focus:outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Message
            </label>
            <textarea
              rows="5"
              placeholder="Write your message..."
              className="w-full p-3 border border-pink-200 rounded-xl bg-white resize-none focus:outline-none"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold text-lg"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
