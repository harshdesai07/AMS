
export default function HeroSection() {
  return (

    <section className="text-center p-16 bg-blue-500 text-white mt-16">
      <h1 className="text-4xl font-bold">Welcome to AMS</h1>
      <p className="mt-3 text-lg">
        Effortless Attendance Tracking for Students & Employees
      </p>
      {/* <button className="mt-5 bg-white text-blue-600 px-5 py-2 rounded-lg shadow-md hover:bg-gray-200">
        Get Started
      </button> */}

<div className="mt-5 flex justify-center space-x-6">
  <div className="text-center">
    <p className="text-2xl font-bold">5K+</p>
    <p className="text-sm">Students Tracked</p>
  </div>
  <div className="text-center">
    <p className="text-2xl font-bold">1K+</p>
    <p className="text-sm">Employees Managed</p>
  </div>
</div>
    </section>
  );
}
