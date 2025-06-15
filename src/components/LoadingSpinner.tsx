
import { Brain, Sparkles } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-8">
        {/* Outer spinning ring */}
        <div className="w-20 h-20 border-4 border-purple-200/20 border-t-purple-500 rounded-full animate-spin"></div>
        
        {/* Inner brain icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="h-8 w-8 text-purple-400" />
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-white flex items-center justify-center">
          <Sparkles className="mr-2 h-6 w-6 text-purple-400 animate-pulse" />
          Generating Your Roadmap
        </h3>
        
        <div className="space-y-2 text-gray-300">
          <p className="animate-pulse">Analyzing your learning goals...</p>
          <p className="animate-pulse delay-300">Curating the best resources...</p>
          <p className="animate-pulse delay-500">Creating your personalized path...</p>
        </div>
        
        <div className="flex justify-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
