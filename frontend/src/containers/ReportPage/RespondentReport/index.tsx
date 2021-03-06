import React, {FC, useEffect} from 'react';
import {connect, ConnectedProps} from "react-redux";
import LoaderWrapper from "../../../components/helpers/LoaderWrapper";
import styles from "../styles.module.sass";
import {Header, Segment} from "semantic-ui-react";
import {IQuestion} from "../../../models/forms/Questions/IQuesion";
import {loadRespondentReportRoutine} from "../../../sagas/report/routines";
import UIContent from "../../../components/UI/UIContent";
import UIColumn from "../../../components/UI/UIColumn";
import {IAppState} from "../../../models/IAppState";
import TypeToResponseMap from "../../../models/forms/Questions/TypeToResponseMap";
import UIPageTitle from "../../../components/UI/UIPageTitle";

const RespondentReport: FC<ConnectedReportPageProps & { match }> = ({
                                                                        match,
                                                                        userReport,
                                                                        isLoading,
                                                                        loadReport
                                                                    }) => {
    useEffect(() => {
        loadReport(match.params.respondent);
    }, [match.params.respondent, loadReport]);

    return (
        <>
            <UIPageTitle title="User Report Info"/>
            <br/>
            <br/>
            <UIContent>
                <UIColumn>
                    <LoaderWrapper loading={isLoading}>
                        {userReport &&
                        renderUserReport(userReport, match.params.username)
                        }
                    </LoaderWrapper>
                </UIColumn>
            </UIContent>
        </>
    );
};

function renderUserReport(userReport: IQuestion[], username: string) {
    return (
        <div className={styles.report_page_block}>
            <Header as='h4'>Respondent: {username}</Header>
            {userReport.map(question => (
                <Segment key={question.id}>
                    <Header as='h4'>{question.name}</Header>
                    {TypeToResponseMap.get(question.type.toUpperCase())?.
                    ({question, response: question.answer})}
                </Segment>
            ))}
        </div>
    );
}

// function renderQuestionResponse(question: IQuestion) {
//   switch (question.type) {
//     case QuestionType.scale:
//       return <ScaleQuestionResponse question={question} response={question.answer} />;
//     case QuestionType.date:
//       return <DateSelectionResponse question={question} response={question.answer} />;
//     case QuestionType.radio:
//       return <RadioButtonResponse question={question} response={question.answer} />;
//     case QuestionType.checkbox:
//       return <CheckboxResponse question={question} response={question.answer} />;
//     case QuestionType.freeText:
//       return <FreeTextResponse question={question} response={question.answer} />;
//     default:
//       return undefined;
//   }
// }

const mapStateToProps = (state: IAppState) => ({
    userReport: state.questionnaireReports.currentUserReport,
    isLoading: state.questionnaireReports.isLoadingUserReport
});

const mapDispatchToProps = {
    loadReport: loadRespondentReportRoutine
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConnectedReportPageProps = ConnectedProps<typeof connector>;

export default connector(RespondentReport);
