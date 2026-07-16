function Navbar() {
    return (
      <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between shadow-sm">
        <header className="flex items-center gap-2">
          <span className="text-xl">🚗</span>
          <h2 className="text-xl font-bold text-blue-600 tracking-wide">AutoInventory</h2>
        </header>
  
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <span>Kevin Lizano Vargas</span>
          <span>Kevin Jesús Quirós Hidalgo</span>
          <span>Emily Monique Thoms Amador</span>
        </div>
      </nav>
    );
  }
  
  export default Navbar;