import React, {FC} from 'react';
import {
    addQuestionnaireRoutine,
    deleteQuestionnaireRoutine,
    hideModalQuestionnaireRoutine,
    loadQuestionnairesRoutine,
    setQuestionnairePaginationRoutine,
    showModalQuestionnaireRoutine,
    updateQuestionnaireRoutine
} from "../../sagas/qustionnaires/routines";
import {IAppState} from "../../models/IAppState";
import {connect, ConnectedProps} from "react-redux";
import QuestionnaireModal from "./questionnaireModal";
import GenericPagination from "../../components/GenericPagination";
import {history} from '../../helpers/history.helper';
import {clearOneQuestionnaireRoutine} from "../../sagas/expandedQuestionnaire/routines";
import {IQuestionnaire} from "../../models/forms/Questionnaires/types";
import UICard from "../../components/UI/UICard";
import UICardBlock from "../../components/UI/UICardBlock";
import UIPageTitle from "../../components/UI/UIPageTitle";
import UIContent from "../../components/UI/UIContent";
import UIColumn from "../../components/UI/UIColumn";
import UIButton from "../../components/UI/UIButton";
import {Icon, Popup} from "semantic-ui-react";
import styles from './styles.module.sass';

const QuestionnaireList: FC<Props> = (
    {
        pagination,
        modalQuestionnaire,
        modalShown,
        isLoading,
        modalLoading,
        modalError,
        loadQuestionnaires,
        deleteQuestionnaire,
        addQuestionnaire,
        updateQuestionnaire,
        showModal,
        hideModal,
        setPagination,
        clearOneQuestionnaire
    }
) => {
    const mapItemToJSX = (item: IQuestionnaire) => (
        <UICard>
            <UICardBlock className={styles.cardBlockWrapper}>
                <h3>{item.title}</h3>
                <div className={styles.cardIconWrapper}>
                  <Popup
                    content="New request"
                    position="top center"
                    trigger={
                      <Icon
                        name="share alternate"
                        onClick={() => history.push(`/questionnaires/${item.id}/new-request`)}
                        className={styles.cardIcon}
                      />
                    }
                  />
                  <Popup
                    content="Show requests and reports"
                    position="top center"
                    trigger={
                      <Icon
                        name="chart bar"
                        onClick={() => {
                          history.push(`/questionnaires/${item.id}/requests`);
                        }}
                        className={styles.cardIcon}
                      />
                    }
                  />
                  <Popup
                    content="Manage questions"
                    position="top center"
                    trigger={
                      <Icon
                        name="settings"
                        onClick={() => {
                          clearOneQuestionnaire();
                          history.push(`/questionnaires/${item.id}`);
                        }}
                        className={styles.cardIcon}
                      />
                    }
                  />
                  <Popup
                    content="Change title"
                    position="top center"
                    trigger={
                      <Icon
                        name="edit"
                        onClick={() => showModal(item)}
                        className={styles.cardIcon}
                      />
                    }
                  />
                  <Popup
                    content="Delete questionnaire"
                    position="top center"
                    trigger={
                      <Icon
                        name="trash"
                        onClick={() => deleteQuestionnaire(item.id)}
                        className={styles.cardIcon}
                      />
                    }
                  />
                </div>
            </UICardBlock>
        </UICard>
    );

    return (
        <>
            <QuestionnaireModal
                modalShown={modalShown}
                hideModal={hideModal}
                modalQuestionnaire={modalQuestionnaire}
                isLoading={modalLoading}
                addQuestionnaire={addQuestionnaire}
                updateQuestionnaire={updateQuestionnaire}
                modalError={modalError}
            />
            <UIPageTitle title="Questionnaires"/>
            <UIContent>
                <UIColumn wide>
                    <UIButton
                        title="Add Questionnaire"
                        onClick={() => showModal(undefined)}
                        center
                        primary
                    />
                    <GenericPagination
                        isLoading={isLoading}
                        pagination={pagination}
                        setPagination={setPagination}
                        loadItems={loadQuestionnaires}
                        mapItemToJSX={mapItemToJSX}
                    />
                </UIColumn>
            </UIContent>
        </>
    );
};

const mapStateToProps = (rootState: IAppState) => ({
    pagination: rootState.questionnaires.list.pagination,
    modalShown: rootState.questionnaires.list.modalShown,
    modalQuestionnaire: rootState.questionnaires.list.modalQuestionnaire,
    isLoading: rootState.questionnaires.list.isLoading,
    modalLoading: rootState.questionnaires.list.modalLoading,
    modalError: rootState.questionnaires.list.modalError
});

const mapDispatchToProps = {
    loadQuestionnaires: loadQuestionnairesRoutine,
    deleteQuestionnaire: deleteQuestionnaireRoutine,
    addQuestionnaire: addQuestionnaireRoutine,
    updateQuestionnaire: updateQuestionnaireRoutine,
    showModal: showModalQuestionnaireRoutine,
    hideModal: hideModalQuestionnaireRoutine,
    setPagination: setQuestionnairePaginationRoutine,
    clearOneQuestionnaire: clearOneQuestionnaireRoutine
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(QuestionnaireList);
