const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(91vh-0.2rem)]">
      <div className="text-center">
        <div
          className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-transparent border-gray-200"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
