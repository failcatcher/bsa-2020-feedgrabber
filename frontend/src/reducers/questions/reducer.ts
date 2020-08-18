import {
    loadQuestionsRoutine, loadQuestionByIdRoutine,
    saveQuestionToQuestionnaireRoutine, deleteFromQuestionnaireRoutine,
    addNewQuestionToQuestionnaireRoutine, copyQuestionInQuestionnaireRoutine
} from "sagas/questions/routines";
import { IAppState } from "models/IAppState";
import { IQuestion } from "../../models/forms/Questions/IQuesion";
import defaultQuestion from "../../models/forms/Questions/DefaultQuestion";
import { ICategoriesState } from "models/categories/ICategorie";
import { loadCategoriesRoutine } from "sagas/categories/routines";

export interface IQuestionsState {
    list?: IQuestion[];
    current?: IQuestion;
    categories?: ICategoriesState;
    isLoading?: boolean;
}

const initialState: IAppState['questions'] = {
    list: [] as IQuestion[],
    categories: {
        list: [] as string[]
    } as ICategoriesState,
    current: defaultQuestion as IQuestion,
    isLoading: false
};

const questionsReducer = (state: IQuestionsState = initialState, { type, payload }) => {
    switch (type) {
        case copyQuestionInQuestionnaireRoutine.SUCCESS:
        case addNewQuestionToQuestionnaireRoutine.SUCCESS:
        case loadQuestionsRoutine.SUCCESS:
            return {
                ...state,
                list: payload,
                isLoading: false
            };
        case loadCategoriesRoutine.SUCCESS:
            return {
                ...state,
                categories: {
                    list: payload,
                    isLoading: false
                }
            };
        case loadCategoriesRoutine.TRIGGER:
            return {
                ...state,
                categories: {
                    list: state.categories.list,
                    isLoading: true
                }
            };
        case loadCategoriesRoutine.FAILURE:
            return {
                ...state,
                categories: {
                    list: [],
                    isLoading: false
                }
            };
        case saveQuestionToQuestionnaireRoutine.SUCCESS:
        case loadQuestionByIdRoutine.SUCCESS:
        case deleteFromQuestionnaireRoutine.SUCCESS:
            return {
                ...state,
                current: payload,
                list: [...state.list, payload],
                isLoading: false
            };
        case copyQuestionInQuestionnaireRoutine.TRIGGER:
        case addNewQuestionToQuestionnaireRoutine.TRIGGER:
        case saveQuestionToQuestionnaireRoutine.TRIGGER:
        case loadQuestionsRoutine.TRIGGER:
        case loadQuestionByIdRoutine.TRIGGER:
        case deleteFromQuestionnaireRoutine.TRIGGER:
            return {
                ...state,
                isLoading: true
            };
        case copyQuestionInQuestionnaireRoutine.FAILURE:
        case addNewQuestionToQuestionnaireRoutine.FAILURE:
        case saveQuestionToQuestionnaireRoutine.FAILURE:
        case loadQuestionByIdRoutine.FAILURE:
        case loadQuestionsRoutine.FAILURE:
        case deleteFromQuestionnaireRoutine.FAILURE:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }

};

export default questionsReducer;
