import React, {FC, useEffect} from 'react';
import {connect, ConnectedProps} from "react-redux";
import styles from './styles.module.sass';
import Form from 'components/Form';
import {IAppState} from 'models/IAppState';
import QuestionMenu from "../../components/Form/QuestionMenu";
import {
    addQuestionToSectionRoutine,
    createSectionRoutine, deleteQuestionFromSectionRoutine, setCurrentQuestionInSection,
    updateQuestionsOrderRoutine,
    updateSectionRoutine,
    updateSections
} from 'sagas/sections/routines';
import UIContent from "../../components/UI/UIContent";
import defaultQuestion from "../../models/forms/Questions/DefaultQuestion";
import LoaderWrapper from "../../components/helpers/LoaderWrapper";
import {toastr} from "react-redux-toastr";
import {loadOneQuestionnaireRoutine} from "../../sagas/qustionnaires/routines";
import UIPageTitle from "../../components/UI/UIPageTitle";
import {setFloatingMenuPos, toggleMenuRoutine} from "../../sagas/app/routines";

const FormEditor: FC<FormEditorProps & { match }> = (
    {
        match,
        isLoading,
        setMenuPos,
        setCurrentQuestion,
        questionnaire,
        sections,
        loadQuestionnaire,
        addQuestion,
        toggleMenu,
        deleteQuestion,
        currentQuestion,
        createSection,
        currentSection,
        updateSection,
        updateSectionsR,
        updateOrder
    }
) => {
    useEffect(() => {
        loadQuestionnaire(match.params.id);
        toggleMenu(false);
    }, [match.params.id, loadQuestionnaire, toggleMenu]);

    const addNewQuestion = () => {
        const section = currentSection ?? sections[sections.length - 1];
        addQuestion({
            ...defaultQuestion,
            questionnaireId: match.params.id,
            sectionId: section.id,
            index: section.questions?.length ?? 0
        });
    };

    const handleAddSection = () => createSection({questionnaireId: match.params.id, index: sections.length});

    const copyQuestion = () => {
        if (!currentQuestion.id) {
            toastr.info("Choose question");
            return;
        }
        const section = currentSection ?? sections[sections.length - 1];
        addQuestion({
            ...currentQuestion,
            name: `${currentQuestion.name} (copy)`,
            sectionId: section.id,
            index: section.questions.length
        });
    };

    const handleDeleteQuestion = () => deleteQuestion({
        questionId: currentQuestion.id,
        sectionId: currentSection.id
    });

    return (
        <>
            <UIPageTitle title=""/>
            {questionnaire && (
                <div className={styles.formDetails}>
                    <LoaderWrapper loading={isLoading}>
                        <UIContent>
                            <div className={styles.questions_container}>
                                <Form
                                    updateSections={updateSectionsR}
                                    setMenuPos={setMenuPos}
                                    setCurrentQuestion={setCurrentQuestion}
                                    updateSection={updateSection}
                                    updateOrder={updateOrder}
                                    currentQuestion={currentQuestion}
                                    sections={sections}
                                />
                            </div>
                            <QuestionMenu
                                addQuestion={addNewQuestion}
                                copyQuestion={copyQuestion}
                                currentQuestion={currentQuestion ?? defaultQuestion}
                                onDelete={handleDeleteQuestion}
                                addSection={handleAddSection}
                            />
                        </UIContent>
                    </LoaderWrapper>
                </div>)}
        </>
    );
};

const mapStateToProps = (state: IAppState) => ({
    currentQuestion: state.formEditor.currentQuestion,
    questionnaire: state.formEditor.questionnaire,
    isLoading: state.formEditor.isLoading,
    sections: state.formEditor.sections.list,
    currentSection: state.formEditor.sections.current
});

const mapDispatchToProps = {
    loadQuestionnaire: loadOneQuestionnaireRoutine,
    updateSection: updateSectionRoutine,
    setMenuPos: setFloatingMenuPos,
    setCurrentQuestion: setCurrentQuestionInSection,
    toggleMenu: toggleMenuRoutine,
    addQuestion: addQuestionToSectionRoutine,
    deleteQuestion: deleteQuestionFromSectionRoutine,
    createSection: createSectionRoutine,
    updateSectionsR: updateSections,
    updateOrder: updateQuestionsOrderRoutine
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type FormEditorProps = ConnectedProps<typeof connector>;

export default connector(FormEditor);