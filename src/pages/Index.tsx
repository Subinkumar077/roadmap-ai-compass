
import { useState } from 'react';
import { Brain, Sparkles, ArrowRight } from 'lucide-react';
import RoadmapForm from '@/components/RoadmapForm';
import RoadmapDisplay from '@/components/RoadmapDisplay';
import { RoadmapData } from '@/types/roadmap';

const Index = () => {
  const [generatedRoadmap, setGeneratedRoadmap] = useState<RoadmapData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 rounded-full"></div>
                <Brain className="relative h-20 w-20 text-purple-400 mx-auto" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              AI Roadmap
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent ml-4">
                Generator
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Generate comprehensive learning roadmaps for any tech skill with AI-powered recommendations, 
              curated resources, and visual progress tracking.
            </p>

            <div className="flex items-center justify-center space-x-6 mb-16">
              <div className="flex items-center text-purple-300">
                <Sparkles className="h-5 w-5 mr-2" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center text-purple-300">
                <ArrowRight className="h-5 w-5 mr-2" />
                <span>Step-by-Step</span>
              </div>
              <div className="flex items-center text-purple-300">
                <Brain className="h-5 w-5 mr-2" />
                <span>Personalized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!generatedRoadmap ? (
          <RoadmapForm 
            onRoadmapGenerated={setGeneratedRoadmap}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        ) : (
          <RoadmapDisplay 
            roadmap={generatedRoadmap}
            onGenerateNew={() => setGeneratedRoadmap(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
