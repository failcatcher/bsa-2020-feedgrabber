import { createRoutine } from 'redux-saga-routines';

export const loadQuestionnairesRoutine = createRoutine('QUESTIONNAIRE:LOAD');
export const showModalQuestionnaireRoutine = createRoutine('QUESTIONNAIRE:SHOW_MODAL');
export const hideModalQuestionnaireRoutine = createRoutine('QUESTIONNAIRE:HIDE_MODAL');
export const addQuestionnaireRoutine = createRoutine('QUESTIONNAIRE:ADD');
export const updateQuestionnaireRoutine = createRoutine('QUESTIONNAIRE:UPDATE');
export const deleteQuestionnaireRoutine = createRoutine('QUESTIONNAIRE:DELETE');