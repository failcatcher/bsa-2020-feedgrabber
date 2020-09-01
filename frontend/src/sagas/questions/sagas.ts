import {all, call, put, takeEvery} from 'redux-saga/effects';
import {
    addSelectedQuestionsRoutine,
    loadQuestionByIdRoutine,
    loadQuestionnaireQuestionsRoutine,
    loadQuestionsRoutine,
    indexQuestionsRoutine,
    deleteFromQuestionnaireRoutine,
    saveQuestionRoutine,
    loadQuestionsBySectionRoutine
} from './routines';
import apiClient from '../../helpers/apiClient';
import {IGeneric} from 'models/IGeneric';
import {toastr} from 'react-redux-toastr';
import {IQuestion} from "../../models/forms/Questions/IQuesion";
import defaultQuestion from "../../models/forms/Questions/DefaultQuestion";
import {updateQuestions} from "../../helpers/array.helper";
import { loadSectionsByQuestionnaireRoutine } from 'sagas/sections/routines';

export function parseQuestion(rawQuestion) {
    const details = rawQuestion.details
        ? JSON.parse(rawQuestion.details as string)
        : {};
    return {
        ...rawQuestion,
        type: rawQuestion.type,
        details
    };
}

function* getAll() {
    try {
        const res: IGeneric<IQuestion[]> = yield call(apiClient.get, `/api/questions`);

        const questions = res.data.data.map(q => parseQuestion(q));

        yield put(loadQuestionsRoutine.success(questions));

    } catch (e) {
        yield put(loadQuestionsRoutine.failure());
        toastr.error("Unable to load questions");
    }
}

function* getById(action) {
    try {
        const {id, top, right} = action.payload;
        if (!id) {
            yield put(loadQuestionByIdRoutine.success(defaultQuestion));
            return;
        }
        const res: IGeneric<IQuestion> = yield call(apiClient.get, `/api/questions/${id}`);

        const question: IQuestion = parseQuestion(res.data.data);
        if (top && right) {
            question['top'] = top;
            question['right'] = right;
        }
        yield put(loadQuestionByIdRoutine.success(question));
    } catch (e) {
        yield put(loadQuestionByIdRoutine.failure(e.data.error));
        toastr.error("Unable to load question");
    }
}

function* getByQuestionnaireId(action) {
    try {
        const res: IGeneric<IQuestion[]> = yield call(apiClient.get, `/api/questions/questionnaires/${action.payload}`);

        const questions = res.data.data.map(q => parseQuestion(q));

        yield put(loadQuestionnaireQuestionsRoutine.success(questions));

    } catch (e) {
        yield put(loadQuestionnaireQuestionsRoutine.failure(e.data.error));
        toastr.error("Unable to load questionnaire");
    }
}

function* addFromExisting(action) {
    // payload: {questionnaireId; questions}}
    try {
        const res: IGeneric<IQuestion[]> = yield call(apiClient.patch, `/api/questions`, action.payload);

        const questions = res.data.data.map(q => parseQuestion(q));

        yield put(addSelectedQuestionsRoutine.success(questions));
        yield put(loadSectionsByQuestionnaireRoutine.trigger(action.payload.questionnaireId));
    } catch (e) {
        yield put(addSelectedQuestionsRoutine.failure(e.data.error));
        toastr.error("Something went wrong, try again");
    }
}

function* saveOrUpdateQuestion(action) {
    try {
        const res: IGeneric<IQuestion> = action.payload?.id
            ? yield call(apiClient.put, `/api/questions`, action.payload)
            : yield call(apiClient.post, `/api/questions`, action.payload);
        const question: IQuestion = parseQuestion(res.data.data);
        yield put(saveQuestionRoutine.success(question));
        const questions = action.payload?.questionnaireQuestions;

        if (!questions) {
            return;
        }
        const newQuestions = updateQuestions(questions, question);

        yield put(loadQuestionnaireQuestionsRoutine.success(newQuestions));
        yield put(loadSectionsByQuestionnaireRoutine.trigger(action.payload.questionnaireId));
    } catch (e) {
        yield put(saveQuestionRoutine.failure());
        toastr.error("Question wasn't saved");
    }
}

function* deleteOneByQuestionnaireId(action) {
    try {
        const {questionId, questionnaireId} = action.payload;
        console.log(action.payload);
        const res: IGeneric<IQuestion[]> = yield call(
            apiClient.delete, `/api/questions/questionnaires/${questionId}/${questionnaireId}`,
            action.payload
        );

        const questions = res.data.data.map(q => parseQuestion(q));

        yield put(deleteFromQuestionnaireRoutine.success(questions));
        yield put(loadSectionsByQuestionnaireRoutine.trigger(questionnaireId));
    } catch (e) {
        yield put(deleteFromQuestionnaireRoutine.failure(e.data.error));
        toastr.error("Unable to delete question");
    }
}

function* orderQuestions(action) {
    try {
        yield call(apiClient.put, `/api/questions/index`, action.payload);
    } catch {
        toastr.error("Unable to index questionnaire");
    }
}

function* getBySectionId(action) {
  try {
      const res: IGeneric<IQuestion[]> = yield call(apiClient.get, `/api/questions/sections/${action.payload}`);

    const questions = res.data.data.map(q => parseQuestion(q));

    yield put(loadQuestionnaireQuestionsRoutine.success(questions));
  } catch (e) {
      yield put(loadQuestionnaireQuestionsRoutine.failure(e.data.error));
      toastr.error("Unable to load questionnaire");
  }
}

export default function* questionSagas() {

    yield all([
        yield takeEvery(loadQuestionsRoutine.TRIGGER, getAll),
        yield takeEvery(loadQuestionByIdRoutine.TRIGGER, getById),
        yield takeEvery(loadQuestionnaireQuestionsRoutine.TRIGGER, getByQuestionnaireId),
        yield takeEvery(addSelectedQuestionsRoutine.TRIGGER, addFromExisting),
        yield takeEvery(indexQuestionsRoutine.TRIGGER, orderQuestions),
        yield takeEvery(deleteFromQuestionnaireRoutine.TRIGGER, deleteOneByQuestionnaireId),
        yield takeEvery(saveQuestionRoutine.TRIGGER, saveOrUpdateQuestion),
        yield takeEvery(loadQuestionsBySectionRoutine.TRIGGER, getBySectionId)
    ]);
}
