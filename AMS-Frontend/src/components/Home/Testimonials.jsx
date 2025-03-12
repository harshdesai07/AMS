export default function Testimonials() {
    const testimonials = [
      { name: "John Doe", feedback: "AMS has made attendance tracking effortless for our team!" },
      { name: "Sarah Lee", feedback: "User-friendly interface and real-time updates. Highly recommended!" }
    ];
  
    return (
      <section className="p-12 text-center">
        <h2 className="text-2xl font-bold">What Users Say</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} name={testimonial.name} feedback={testimonial.feedback} />
          ))}
        </div>
      </section>
    );
  }
  
  function TestimonialCard({ name, feedback }) {
    return (
      <div className="p-6 border rounded-lg shadow-md hover:shadow-lg bg-gray-50">
        <p className="italic">"{feedback}"</p>
        <h3 className="mt-4 font-bold">- {name}</h3>
      </div>
    );
  }
  