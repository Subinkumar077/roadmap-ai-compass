
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, level, duration, additionalInfo } = await req.json();
    
    console.log('Generating roadmap with params:', { topic, level, duration, additionalInfo });
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment');
    }

    const prompt = `Create a comprehensive learning roadmap for "${topic}" for a ${level} level learner over ${duration}. ${additionalInfo ? `Additional context: ${additionalInfo}` : ''}

Please provide a structured response in the following JSON format:
{
  "title": "Learning Roadmap Title",
  "description": "Brief description of what the learner will achieve",
  "level": "${level}",
  "totalDuration": "${duration}",
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase Title",
      "description": "What the learner will accomplish in this phase",
      "duration": "Time needed for this phase",
      "resources": [
        {
          "title": "Resource Title",
          "url": "https://example.com",
          "type": "video",
          "platform": "YouTube",
          "duration": "estimated time"
        }
      ],
      "projects": ["Project suggestions for this phase"],
      "prerequisites": ["What should be completed before this phase"]
    }
  ]
}

Make sure to:
1. Include 4-6 phases for comprehensive learning
2. Provide real, actionable resources with actual URLs when possible
3. Include a mix of videos, articles, courses, and hands-on projects
4. Make each phase build upon the previous one
5. Include popular platforms like YouTube, Coursera, freeCodeCamp, Udemy, official documentation
6. Ensure resources are high-quality and relevant
7. Return only valid JSON without any markdown formatting or additional text`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);
    
    // Clean the response to extract JSON
    let jsonText = generatedText;
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    
    // Find the JSON object
    const jsonStart = jsonText.indexOf('{');
    const jsonEnd = jsonText.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No valid JSON found in response');
    }
    
    jsonText = jsonText.substring(jsonStart, jsonEnd);
    
    let roadmapData;
    try {
      roadmapData = JSON.parse(jsonText);
      console.log('Parsed roadmap data:', roadmapData);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', jsonText);
      throw new Error('Failed to parse roadmap data');
    }
    
    // Generate flowchart data
    const flowchartData = generateFlowchartData(roadmapData.phases || []);
    roadmapData.flowchartData = flowchartData;
    
    return new Response(JSON.stringify(roadmapData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-roadmap function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate roadmap. Please try again.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

const generateFlowchartData = (phases: any[]) => {
  const nodes = [];
  const edges = [];
  
  // Start node
  nodes.push({
    id: 'start',
    type: 'input',
    data: { label: 'Start Learning' },
    position: { x: 250, y: 0 }
  });
  
  // Phase nodes
  phases.forEach((phase, index) => {
    const nodeId = phase.id || `phase-${index + 1}`;
    nodes.push({
      id: nodeId,
      type: 'default',
      data: { label: phase.title },
      position: { x: 250, y: (index + 1) * 150 }
    });
    
    // Connect to previous node
    const sourceId = index === 0 ? 'start' : phases[index - 1].id || `phase-${index}`;
    edges.push({
      id: `edge-${index}`,
      source: sourceId,
      target: nodeId
    });
  });
  
  // End node
  const endNodeId = 'end';
  nodes.push({
    id: endNodeId,
    type: 'output',
    data: { label: 'Complete!' },
    position: { x: 250, y: (phases.length + 1) * 150 }
  });
  
  // Connect last phase to end
  if (phases.length > 0) {
    const lastPhaseId = phases[phases.length - 1].id || `phase-${phases.length}`;
    edges.push({
      id: `edge-final`,
      source: lastPhaseId,
      target: endNodeId
    });
  }
  
  return { nodes, edges };
};
