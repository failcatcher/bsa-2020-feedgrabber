import { createRoutine } from 'redux-saga-routines';

export const loadQuestionsRoutine = createRoutine('QUESTION:LOAD_ALL');
export const saveQuestionRoutine = createRoutine('QUESTION:SAVE');