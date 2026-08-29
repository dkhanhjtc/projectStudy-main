// src/lib/mockData.js

export const mockLessons = {
  vocabulary: [
    { id: 'v1', title: 'TOEIC Vocabulary - Part 1', type: 'flashcard', progress: '15/30' },
    { id: 'v2', title: 'IELTS Core Words - Unit 1', type: 'quiz', progress: '0/20' },
  ],
  grammar: [
    { id: 'g1', title: 'Present Perfect Tense', type: 'quiz', progress: '5/10' },
    { id: 'g2', title: 'Relative Clauses', type: 'flashcard', progress: '0/15' },
  ],
  listening: [
    { 
      id: 'l1', 
      title: 'Listening Part 1 - Practice',
      audioUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', // Dummy audio
      transcript: 'The quick brown fox jumps over the lazy dog. This is a simple test of your listening skills.',
      blanks: [
        { index: 1, word: 'quick' },
        { index: 3, word: 'fox' },
        { index: 11, word: 'listening' }
      ]
    }
  ],
  reading: [
    {
      id: 'r1',
      title: 'Reading: Skimming & Scanning',
      passage: `Global warming is the long-term heating of Earth's climate system observed since the pre-industrial period (between 1850 and 1900) due to human activities, primarily fossil fuel burning, which increases heat-trapping greenhouse gas levels in Earth's atmosphere. \n\nThe term is frequently used interchangeably with the term climate change, though the latter refers to both human- and naturally produced warming and the effects it has on our planet.`,
      questions: [
        {
          id: 'q1',
          text: 'What is the primary cause of global warming mentioned in the text?',
          options: ['Volcanic eruptions', 'Fossil fuel burning', 'Solar radiation', 'Deforestation'],
          correctAnswer: 1 // index of 'Fossil fuel burning'
        },
        {
          id: 'q2',
          text: 'When was the pre-industrial period?',
          options: ['1750-1800', '1900-1950', '1850-1900', '2000-2020'],
          correctAnswer: 2
        }
      ]
    }
  ],
  users: [
    { id: 'u1', email: 'user@lea.com', name: 'John Doe', role: 'user', status: 'active' },
    { id: 'u2', email: 'student@lea.com', name: 'Alice', role: 'user', status: 'active' },
    { id: 'u3', email: 'admin@lea.com', name: 'Admin', role: 'admin', status: 'active' },
  ]
};
