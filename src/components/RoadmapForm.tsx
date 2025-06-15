
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Clock, Target } from 'lucide-react';
import { generateRoadmap } from '@/services/geminiService';
import { RoadmapData } from '@/types/roadmap';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';

interface RoadmapFormProps {
  onRoadmapGenerated: (roadmap: RoadmapData) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

const RoadmapForm = ({ onRoadmapGenerated, isGenerating, setIsGenerating }: RoadmapFormProps) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic or skill you want to learn.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const roadmap = await generateRoadmap({
        topic: topic.trim(),
        level: level || 'beginner',
        duration: duration || '3 months',
        additionalInfo: additionalInfo.trim()
      });
      
      onRoadmapGenerated(roadmap);
      
      toast({
        title: "Roadmap Generated!",
        description: "Your personalized learning roadmap is ready.",
      });
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const popularTopics = [
    'Full Stack Development',
    'Machine Learning',
    'Data Science',
    'Mobile App Development',
    'DevOps',
    'Cybersecurity',
    'Blockchain',
    'Cloud Computing',
    'UI/UX Design',
    'System Design'
  ];

  if (isGenerating) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center">
            <Sparkles className="mr-3 h-6 w-6 text-purple-400" />
            Generate Your Learning Roadmap
          </CardTitle>
          <p className="text-gray-300 mt-2">
            Tell us what you want to learn, and we'll create a personalized roadmap just for you.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-white font-medium flex items-center">
                <Target className="mr-2 h-4 w-4 text-purple-400" />
                What do you want to learn?
              </Label>
              <Input
                id="topic"
                type="text"
                placeholder="e.g., Full Stack Development, Machine Learning, React..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
              />
            </div>

            {/* Popular Topics */}
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Popular Topics:</Label>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((popularTopic) => (
                  <Button
                    key={popularTopic}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTopic(popularTopic)}
                    className="bg-gray-700/30 border-gray-600 text-gray-300 hover:bg-purple-600/20 hover:border-purple-500 hover:text-white transition-all duration-200"
                  >
                    {popularTopic}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="level" className="text-white font-medium">
                  Experience Level
                </Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="beginner" className="text-white hover:bg-gray-700">
                      Beginner - New to this field
                    </SelectItem>
                    <SelectItem value="intermediate" className="text-white hover:bg-gray-700">
                      Intermediate - Some experience
                    </SelectItem>
                    <SelectItem value="advanced" className="text-white hover:bg-gray-700">
                      Advanced - Experienced learner
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-white font-medium flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-purple-400" />
                  Learning Duration
                </Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="How long do you have?" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="1 month" className="text-white hover:bg-gray-700">
                      1 Month - Intensive
                    </SelectItem>
                    <SelectItem value="3 months" className="text-white hover:bg-gray-700">
                      3 Months - Standard
                    </SelectItem>
                    <SelectItem value="6 months" className="text-white hover:bg-gray-700">
                      6 Months - Comprehensive
                    </SelectItem>
                    <SelectItem value="1 year" className="text-white hover:bg-gray-700">
                      1 Year - Deep Dive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-white font-medium">
                Additional Information (Optional)
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any specific goals, technologies you want to focus on, or background information..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Roadmap...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate AI Roadmap
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadmapForm;
