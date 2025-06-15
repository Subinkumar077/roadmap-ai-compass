
const GEMINI_API_KEY = 'AIzaSyCVvzL4dDZQx83DG_QdR1kRLA8842BIYKo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GenerateRoadmapParams {
  topic: string;
  level: string;
  duration: string;
  additionalInfo?: string;
}

export const generateRoadmap = async (params: GenerateRoadmapParams) => {
  console.log('Generating roadmap with params:', params);
  
  const prompt = `Create a comprehensive learning roadmap for "${params.topic}" for a ${params.level} level learner over ${params.duration}. ${params.additionalInfo ? `Additional context: ${params.additionalInfo}` : ''}

Please provide a structured response in the following JSON format:
{
  "title": "Learning Roadmap Title",
  "description": "Brief description of what the learner will achieve",
  "level": "${params.level}",
  "totalDuration": "${params.duration}",
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
          "type": "video|article|course|documentation|project",
          "platform": "YouTube|Coursera|freeCodeCamp|etc",
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

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
    
    try {
      const roadmapData = JSON.parse(jsonText);
      console.log('Parsed roadmap data:', roadmapData);
      
      // Generate flowchart data
      const flowchartData = generateFlowchartData(roadmapData.phases);
      roadmapData.flowchartData = flowchartData;
      
      return roadmapData;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', jsonText);
      throw new Error('Failed to parse roadmap data');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate roadmap. Please try again.');
  }
};

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
