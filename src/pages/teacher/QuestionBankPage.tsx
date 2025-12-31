import React, { useEffect, useState } from 'react';
import { teacherService } from '@/api/teacherService';
import { Question } from '@/types';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  FileQuestion
} from 'lucide-react';
import { toast } from 'sonner';

export function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    subject: '',
    difficulty: 'MEDIUM' as Question['difficulty'],
    marks: 1,
  });

  const subjects = [...new Set(questions.map(q => q.subject))];

  const fetchQuestions = async () => {
    try {
      const data = await teacherService.getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpenModal = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        questionText: question.questionText,
        options: [...question.options],
        correctAnswer: question.correctAnswer || 0,
        subject: question.subject,
        difficulty: question.difficulty,
        marks: question.marks,
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        subject: '',
        difficulty: 'MEDIUM',
        marks: 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await teacherService.updateQuestion(editingQuestion.questionId, formData);
        toast.success('Question updated successfully');
      } else {
        await teacherService.createQuestion(formData);
        toast.success('Question created successfully');
      }
      handleCloseModal();
      fetchQuestions();
    } catch (error) {
      toast.error(editingQuestion ? 'Failed to update question' : 'Failed to create question');
    }
  };

  const handleDelete = async (questionId: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await teacherService.deleteQuestion(questionId);
      toast.success('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const getDifficultyBadge = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'EASY':
        return <Badge className="bg-success-light text-success hover:bg-success-light">Easy</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-warning-light text-warning hover:bg-warning-light">Medium</Badge>;
      case 'HARD':
        return <Badge className="bg-destructive-light text-destructive hover:bg-destructive-light">Hard</Badge>;
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || q.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  if (isLoading) {
    return <PageLoader text="Loading questions..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground mt-1">
            Manage your examination questions
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border shadow-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.map((question) => (
          <Card key={question.questionId} className="border-border shadow-soft hover:shadow-elevated transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {getDifficultyBadge(question.difficulty)}
                  <Badge variant="outline">{question.subject}</Badge>
                  <Badge variant="secondary">{question.marks} marks</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenModal(question)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(question.questionId)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="font-medium mb-4 line-clamp-2">{question.questionText}</p>
              
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`text-sm px-3 py-2 rounded-lg ${
                      index === question.correctAnswer
                        ? 'bg-success-light text-success font-medium'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No questions found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingQuestion ? 'Edit Question' : 'Add New Question'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Question Text</Label>
            <Textarea
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              placeholder="Enter the question"
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label>Options (mark correct answer)</Label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === index}
                  onChange={() => setFormData({ ...formData, correctAnswer: index })}
                  className="h-4 w-4 text-primary"
                />
                <span className="font-semibold text-sm w-6">{String.fromCharCode(65 + index)}.</span>
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  required
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Mathematics"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: Question['difficulty']) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Marks</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              {editingQuestion ? 'Update' : 'Create'} Question
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
