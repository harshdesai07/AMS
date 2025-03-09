export default function Features() {
    const features = [
      { icon: "📊", title: "Real-time Tracking", desc: "Mark attendance with a click & view real-time reports." },
      { icon: "🔔", title: "Automated Alerts", desc: "Get notified when attendance is below the threshold." },
      { icon: "📅", title: "Reports & Analytics", desc: "Export and analyze attendance data easily." }
    ];
  
    return (
      <section className="p-12 text-center">
        <h2 className="text-2xl font-bold">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} desc={feature.desc} />
          ))}
        </div>
      </section>
    );
  }
  
  function FeatureCard({ icon, title, desc }) {
    return (
      <div className="p-6 border rounded-lg shadow-md hover:shadow-lg">
        <h3 className="text-xl font-bold">{icon} {title}</h3>
        <p className="mt-2">{desc}</p>
      </div>
    );
  }
  