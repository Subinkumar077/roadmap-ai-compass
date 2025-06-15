
import { supabase } from '@/integrations/supabase/client';

interface GenerateRoadmapParams {
  topic: string;
  level: string;
  duration: string;
  additionalInfo?: string;
}

export const generateRoadmap = async (params: GenerateRoadmapParams) => {
  console.log('Generating roadmap with params:', params);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-roadmap', {
      body: {
        topic: params.topic,
        level: params.level,
        duration: params.duration,
        additionalInfo: params.additionalInfo
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error('Failed to generate roadmap. Please try again.');
    }

    if (!data) {
      throw new Error('No data received from roadmap generation');
    }

    console.log('Roadmap generated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error calling generate-roadmap function:', error);
    throw new Error('Failed to generate roadmap. Please try again.');
  }
};
