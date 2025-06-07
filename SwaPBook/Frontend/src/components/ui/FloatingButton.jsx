// src/components/ui/FloatingButton.jsx
const FloatingButton = ({ onClick, isVisible = true, label }) => {
    if (!isVisible) return null;
    
    return (
      <button
        onClick={onClick}
        title={label}
        className="
          fixed z-50 bottom-24 left-1/2 -translate-x-1/2
          bg-Swap-green hover:bg-Swap-green-dark text-white
          px-8 py-4 rounded-full shadow-lg
          text-lg font-bold flex items-center gap-2
          transition-all duration-200 animate-bounce-subtle
        "
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {label}
      </button>
    );
  };
  
  export default FloatingButton;
  