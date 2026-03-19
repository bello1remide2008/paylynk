export default function SecurityQuestions() {
  const questions = [
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What is the name of your childhood best friend?",
    "What city were you born in?",
    "What is your favourite teacher’s name?",
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Top Header */}
      <div className="bg-purple-900 text-white p-5 rounded-t-2xl">
        <h2 className="text-xl font-semibold">Security Questions</h2>
        <p className="text-sm opacity-90">
          Creating questions helps protect your account from unauthorized access
        </p>

        
      </div>

      <div className="bg-white shadow-md rounded-b-2xl p-6 space-y-6">

        {/* Create Security Question */}
        <h3 className="font-semibold text-lg">Create Your Security Question</h3>

        {/* Question 1 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Select a question
          </label>
          <select className="w-full border rounded-lg p-3">
            <option>-- Select a question --</option>
            {questions.map((q, i) => (
              <option key={i}>{q}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Your Answer"
            className="w-full mt-3 border rounded-lg p-3"
          />
        </div>

        {/* Question 2 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Select a question
          </label>
          <select className="w-full border rounded-lg p-3">
            <option>-- Select a question --</option>
            {questions.map((q, i) => (
              <option key={i}>{q}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Your Answer"
            className="w-full mt-3 border rounded-lg p-3"
          />
        </div>

        {/* Security Guidelines */}
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Important Security Guidelines</h4>
          <ul className="space-y-1 text-sm">
            <li>✓ Choose questions with answers that won't change over time</li>
            <li>✓ Use answers that only you would know</li>
            <li>✓ Avoid information that can be found on social media</li>
          </ul>
        </div>

        {/* Remember Answers */}
        <div className="bg-purple-100 p-4 rounded-lg">
          <p className="text-sm font-medium">Remember your answers</p>
        </div>

        {/* Warning Box */}
        <div className="bg-red-100 border border-red-400 p-4 rounded-lg text-sm">
          ⚠️ Make sure you can remember those answers exactly as you typed them.
          They will be required for account recovery and verification purposes.
        </div>

        {/* Buttons + Encryption Note */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-4">

          <button className="border border-red-500 text-red-500 px-5 py-2 rounded-lg">
            Save as Draft
          </button>

          <div className="flex items-center gap-3">
            <button className="bg-red-600 text-white px-5 py-2 rounded-lg">
              Set Security Questions
            </button>

            <span className="text-sm text-green-600">
              ✓ All data is encrypted and securely stored
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}