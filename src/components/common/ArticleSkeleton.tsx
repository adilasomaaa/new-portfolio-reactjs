const ArticleSkeleton = () => {
  return (
    <div className="border border-gray-200 shadow rounded-md p-4 w-full mx-auto mb-4 animate-pulse">
      <div className="animate-pulse flex flex-col space-y-4">
        {/* Placeholder untuk Title */}
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        {/* Placeholder untuk Date/Views */}
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        {/* Placeholder untuk Description */}
        <div className="space-y-2 mt-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSkeleton;