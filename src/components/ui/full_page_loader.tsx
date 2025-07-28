interface FullPageLoaderProps {
  message?: string;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  message = "Loading",
}) => {
  return (
    <div className="fixed inset-0 bg-gaming-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="relative w-24 h-24 mb-6">
        {/* GPU-inspired loader */}
        <div className="absolute inset-0 border-4 border-gaming-blue border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-3 border-4 border-gaming-electric-blue border-b-transparent rounded-full animate-spin animation-delay-150"></div>
      </div>

      <h3 className="text-xl text-gaming-white font-orbitron mb-2">
        {message}
      </h3>
    </div>
  );
};

export default FullPageLoader;
