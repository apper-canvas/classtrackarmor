export const calculateGradePercentage = (points, maxPoints) => {
  if (!maxPoints || maxPoints === 0) return 0;
  return Math.round((points / maxPoints) * 100);
};

export const getGradeColor = (percentage) => {
  if (percentage >= 90) return "emerald";
  if (percentage >= 80) return "blue";
  if (percentage >= 70) return "amber";
  if (percentage >= 60) return "orange";
  return "red";
};

export const calculateOverallGrade = (submissions) => {
  const gradedSubmissions = submissions.filter(s => s.grade !== null && s.grade !== undefined);
  
  if (gradedSubmissions.length === 0) return 0;
  
  const totalPoints = gradedSubmissions.reduce((sum, s) => sum + s.grade, 0);
  const totalPossible = gradedSubmissions.reduce((sum, s) => sum + s.pointsPossible, 0);
  
  return calculateGradePercentage(totalPoints, totalPossible);
};