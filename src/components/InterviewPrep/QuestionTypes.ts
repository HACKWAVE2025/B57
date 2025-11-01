export enum QuestionType {
  DSA = 'DSA',
  SystemDesign = 'SystemDesign',
  Behavioral = 'Behavioral',
  Frontend = 'Frontend',
  Database = 'Database',
  OperatingSystem = 'OperatingSystem',
  ComputerNetwork = 'ComputerNetwork',
  CloudDevOps = 'CloudDevOps',
  Puzzle = 'Puzzle',
  Aptitude = 'Aptitude',
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
}

