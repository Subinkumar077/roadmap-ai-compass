import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Target, 
  Book, 
  Video, 
  ExternalLink, 
  Download,
  RefreshCw,
  CheckCircle,
  PlayCircle,
  FileText,
  Code,
  Award
} from 'lucide-react';
import { RoadmapData } from '@/types/roadmap';
import RoadmapFlowchart from './RoadmapFlowchart';
import jsPDF from 'jspdf';

interface RoadmapDisplayProps {
  roadmap: RoadmapData;
  onGenerateNew: () => void;
}

const RoadmapDisplay = ({ roadmap, onGenerateNew }: RoadmapDisplayProps) => {
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set());

  const togglePhaseCompletion = (phaseId: string) => {
    const newCompleted = new Set(completedPhases);
    if (newCompleted.has(phaseId)) {
      newCompleted.delete(phaseId);
    } else {
      newCompleted.add(phaseId);
    }
    setCompletedPhases(newCompleted);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;
    
    // Title
    doc.setFontSize(20);
    doc.text(roadmap.title, 20, yPosition);
    yPosition += 15;
    
    // Description
    doc.setFontSize(12);
    const splitDescription = doc.splitTextToSize(roadmap.description, 170);
    doc.text(splitDescription, 20, yPosition);
    yPosition += splitDescription.length * 5 + 10;
    
    // Basic info
    doc.setFontSize(11);
    doc.text(`Level: ${roadmap.level}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Duration: ${roadmap.totalDuration}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Phases: ${roadmap.phases.length}`, 20, yPosition);
    yPosition += 15;
    
    // Phases
    roadmap.phases.forEach((phase, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Phase title
      doc.setFontSize(14);
      doc.text(`Phase ${index + 1}: ${phase.title}`, 20, yPosition);
      yPosition += 10;
      
      // Phase description
      doc.setFontSize(10);
      const splitPhaseDesc = doc.splitTextToSize(phase.description, 170);
      doc.text(splitPhaseDesc, 20, yPosition);
      yPosition += splitPhaseDesc.length * 4 + 5;
      
      // Duration
      doc.text(`Duration: ${phase.duration}`, 20, yPosition);
      yPosition += 8;
      
      // Prerequisites
      if (phase.prerequisites && phase.prerequisites.length > 0) {
        doc.text('Prerequisites:', 20, yPosition);
        yPosition += 6;
        phase.prerequisites.forEach(prereq => {
          const splitPrereq = doc.splitTextToSize(`• ${prereq}`, 160);
          doc.text(splitPrereq, 25, yPosition);
          yPosition += splitPrereq.length * 4;
        });
        yPosition += 5;
      }
      
      // Resources
      if (phase.resources && phase.resources.length > 0) {
        doc.text('Resources:', 20, yPosition);
        yPosition += 6;
        phase.resources.forEach(resource => {
          const resourceText = `• ${resource.title} (${resource.type})`;
          const splitResource = doc.splitTextToSize(resourceText, 160);
          doc.text(splitResource, 25, yPosition);
          yPosition += splitResource.length * 4;
        });
        yPosition += 5;
      }
      
      // Projects
      if (phase.projects && phase.projects.length > 0) {
        doc.text('Projects:', 20, yPosition);
        yPosition += 6;
        phase.projects.forEach(project => {
          const splitProject = doc.splitTextToSize(`• ${project}`, 160);
          doc.text(splitProject, 25, yPosition);
          yPosition += splitProject.length * 4;
        });
      }
      
      yPosition += 15;
    });
    
    // Save the PDF
    doc.save(`${roadmap.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_roadmap.pdf`);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return PlayCircle;
      case 'article':
        return FileText;
      case 'course':
        return Book;
      case 'project':
        return Code;
      case 'documentation':
        return FileText;
      default:
        return ExternalLink;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'article':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'course':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'project':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'documentation':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            onClick={onGenerateNew}
            variant="outline"
            className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New
          </Button>
          <Button
            onClick={downloadPDF}
            variant="outline"
            className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
        
        <h1 className="text-4xl font-bold text-white">{roadmap.title}</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">{roadmap.description}</p>
        
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center text-purple-300">
            <Target className="mr-2 h-5 w-5" />
            <span className="capitalize">{roadmap.level} Level</span>
          </div>
          <div className="flex items-center text-purple-300">
            <Clock className="mr-2 h-5 w-5" />
            <span>{roadmap.totalDuration}</span>
          </div>
          <div className="flex items-center text-purple-300">
            <Award className="mr-2 h-5 w-5" />
            <span>{roadmap.phases.length} Phases</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="phases" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700">
          <TabsTrigger 
            value="phases" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Learning Phases
          </TabsTrigger>
          <TabsTrigger 
            value="flowchart"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Visual Roadmap
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-6">
          {roadmap.phases.map((phase, index) => {
            const isCompleted = completedPhases.has(phase.id);
            
            return (
              <Card 
                key={phase.id} 
                className={`bg-gray-800/50 backdrop-blur-sm border transition-all duration-300 ${
                  isCompleted 
                    ? 'border-green-500/50 bg-green-500/5' 
                    : 'border-gray-700/50 hover:border-purple-500/30'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        isCompleted ? 'bg-green-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'
                      }`}>
                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{phase.title}</CardTitle>
                        <p className="text-gray-300 mt-2">{phase.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            <Clock className="mr-1 h-3 w-3" />
                            {phase.duration}
                          </Badge>
                          {phase.resources && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              <Book className="mr-1 h-3 w-3" />
                              {phase.resources.length} Resources
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => togglePhaseCompletion(phase.id)}
                      variant={isCompleted ? "default" : "outline"}
                      size="sm"
                      className={isCompleted 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600"
                      }
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Completed
                        </>
                      ) : (
                        'Mark Complete'
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Prerequisites */}
                  {phase.prerequisites && phase.prerequisites.length > 0 && (
                    <div>
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <Target className="mr-2 h-4 w-4 text-purple-400" />
                        Prerequisites
                      </h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {phase.prerequisites.map((prereq, idx) => (
                          <li key={idx}>{prereq}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Resources */}
                  {phase.resources && phase.resources.length > 0 && (
                    <div>
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <Book className="mr-2 h-4 w-4 text-purple-400" />
                        Learning Resources
                      </h4>
                      <div className="grid gap-3">
                        {phase.resources.map((resource, idx) => {
                          const IconComponent = getResourceIcon(resource.type);
                          return (
                            <div 
                              key={idx}
                              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:border-purple-500/30 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <IconComponent className="h-5 w-5 text-purple-400" />
                                <div>
                                  <h5 className="text-white font-medium">{resource.title}</h5>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getResourceColor(resource.type)}`}
                                    >
                                      {resource.type}
                                    </Badge>
                                    {resource.platform && (
                                      <span className="text-gray-400 text-sm">{resource.platform}</span>
                                    )}
                                    {resource.duration && (
                                      <span className="text-gray-400 text-sm">• {resource.duration}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(resource.url, '_blank')}
                                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {phase.projects && phase.projects.length > 0 && (
                    <div>
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <Code className="mr-2 h-4 w-4 text-purple-400" />
                        Suggested Projects
                      </h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {phase.projects.map((project, idx) => (
                          <li key={idx}>{project}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="flowchart">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white text-center">Learning Path Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <RoadmapFlowchart roadmap={roadmap} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoadmapDisplay;
