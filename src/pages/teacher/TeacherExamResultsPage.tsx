import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teacherService } from '@/api/teacherService';
import { ExamResult } from '@/types';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Download, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export function TeacherExamResultsPage() {
    const { examId } = useParams();
    const [results, setResults] = useState<ExamResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                if (!examId) return;
                const data = await teacherService.getExamResults(parseInt(examId));
                setResults(data);
            } catch (error) {
                toast.error('Failed to load exam results');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [examId]);

    if (isLoading) {
        return <PageLoader text="Loading results..." />;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link to="/dashboard">
                        <Button variant="ghost" className="pl-0 mb-2 hover:bg-transparent hover:text-primary">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="font-display text-3xl font-bold">Exam Results</h1>
                    <p className="text-muted-foreground mt-1">
                        View student performance for Exam #{examId}
                    </p>
                </div>
            </div>

            <Card className="border-border shadow-soft overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-display flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Student Scores
                    </CardTitle>
                    <Badge variant="outline">{results.length} Submissions</Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Percentage</TableHead>
                                    <TableHead>Submitted At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No results found for this exam yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    results.map((result) => (
                                        <TableRow key={result.resultId} className="hover:bg-accent/50">
                                            <TableCell className="font-medium">{result.studentName}</TableCell>
                                            <TableCell className="text-muted-foreground">{result.studentEmail || 'N/A'}</TableCell>
                                            <TableCell>{result.score} / {result.totalMarks}</TableCell>
                                            <TableCell>
                                                <Badge variant={result.percentage >= 50 ? 'outline' : 'destructive'} className={result.percentage >= 50 ? 'border-success text-success bg-success/5' : ''}>
                                                    {result.percentage}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(result.submittedAt).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Temporary Badge component import fix
import { Badge } from '@/components/ui/badge';
