export default function HowItWorks() {
    const steps = [
      { number: "1️⃣", title: "Sign Up & Log In" },
      { number: "2️⃣", title: "Mark Attendance" },
      { number: "3️⃣", title: "View Reports" },
      { number: "4️⃣", title: "Export & Analyze" }
    ];
  
    return (
      <section className="bg-gray-100 p-12 text-center">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 mt-6">
          {steps.map((step, index) => (
            <StepCard key={index} number={step.number} title={step.title} />
          ))}
        </div>
      </section>
    );
  }
  
  function StepCard({ number, title }) {
    return (
      <div className="p-6 border rounded-lg shadow-md hover:shadow-lg">
        <h3 className="text-xl font-bold">{number}</h3>
        <p className="mt-2">{title}</p>
      </div>
    );
  }
  