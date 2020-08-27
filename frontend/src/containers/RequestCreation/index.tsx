import React, {useEffect, useState} from "react";
import UIPageTitle from "../../components/UI/UIPageTitle";
import UIContent from "../../components/UI/UIContent";
import UIColumn from "../../components/UI/UIColumn";
import UICard from "../../components/UI/UICard";
import UIButton from "../../components/UI/UIButton";
import UICardBlock from "../../components/UI/UICardBlock";
import {IAppState} from "../../models/IAppState";
import {connect, ConnectedProps} from "react-redux";
import {loadCompanyUsersRoutine, loadTeamsRoutine} from "../../sagas/teams/routines";
import UIUserItemCard from "../../components/UI/UIUserItemCard";
import {Formik} from "formik";
import DatePicker from "react-datepicker";
import styles from './styles.module.sass';
import "react-datepicker/dist/react-datepicker.css";
import {Message} from "semantic-ui-react";
import {sendQuestionnaireRequestRoutine} from "../../sagas/request/routines";
import {history} from '../../helpers/history.helper';
import {IUserShort} from "../../models/user/types";
import {ITeamShort} from "../../models/teams/ITeam";
import UITeamItemCard from "../../components/UI/UITeamItemCard";
import LoaderWrapper from "../../components/LoaderWrapper";
import ExpandedQuestionnaire from "../ExpandedQuestionnaire";
import {RouteComponentProps} from "react-router-dom";
import QuestionnairePreview from "../../components/QuestionnairePreview";
import {indexQuestionsRoutine} from "../../sagas/questions/routines";
import {loadOneQuestionnaireRoutine} from "../../sagas/qustionnaires/routines";
import UISwitch from "../../components/UI/UIInputs/UISwitch";
import UICheckbox from "../../components/UI/UIInputs/UICheckbox";

const initialValues = {
  chosenUsers: new Array<IUserShort>(),
  chosenTeams: new Array<ITeamShort>(),
  targetUserId: null,
  includeTargetUser: false,
  withDeadline: false,
  expirationDate: null,
  notifyUsers: false,
  generateReport: false
};

const RequestCreation: React.FC<ConnectedRequestCreationProps & { match }> =
    ({
       match,
       teams,
       users,
       loadTeams,
       loadUsers,
       loadQuestionnaire,
       sendRequest,
       isLoadingUsers,
       isLoadingTeams,
       questions
     }) => {

      // load users
      useEffect(() => {
        loadUsers();
      }, [loadUsers]);

      // load teams
      useEffect(() => {
        loadTeams();
      }, [loadTeams]);

      // load questionnaire
      useEffect(() => {
        loadQuestionnaire(match.params.id);
      }, [loadQuestionnaire, match.params.id]);

      const [selectTeams, setSelectTeams] = useState(true);
      const [error, setError] = useState(null);
      return (
          <>
            <UIPageTitle title='Send Request'/>
            <UIContent>
              <UIColumn>
                <UICard>
                  <UICardBlock>
                    <QuestionnairePreview
                        indexQuestions={indexQuestionsRoutine}
                        qnId={match.params.id}
                        questions={questions ?? []}
                    />
                  </UICardBlock>
                </UICard>
              </UIColumn>
              <UIColumn>
                <LoaderWrapper loading={!users || isLoadingUsers || !teams || isLoadingTeams}>
                  <UICard>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={values => {
                          if (values.withDeadline && !values.expirationDate) {
                            setError('Select deadline date!');
                            return;
                          }
                          if (values.chosenUsers.length === 0 && values.chosenTeams.length === 0) {
                            setError('Select at least one user or team');
                            return;
                          }
                          setError(null);

                          const data = {
                            expirationDate: values.withDeadline ? values.expirationDate.toISOString() : null,
                            generateReport: values.generateReport,
                            notifyUsers: values.notifyUsers,
                            questionnaireId: match.params.id,
                            targetUserId: values.targetUserId,
                            includeTargetUser: !!values.targetUserId && values.includeTargetUser,
                            respondentIds: values.chosenUsers.map(user => user.id),
                            teamIds: values.chosenTeams.map(team => team.id)
                          };
                          sendRequest(data);
                          history.goBack();
                        }}
                    >
                      {
                        formik => (
                            <form onSubmit={formik.handleSubmit}>

                              <UICardBlock>
                                <h4>Assign target user:</h4>
                                <p>This user will receive report</p>
                                <div style={{height: '200px', overflow: 'auto'}}>
                                  {
                                    users.map(user => (
                                        <UIUserItemCard
                                            key={user.id}
                                            firstName={'username: ' + user.username}
                                            avatar={user.avatar}
                                            onClick={() => {
                                              formik.setFieldValue('targetUserId',
                                                  formik.values.targetUserId === user.id ? null : user.id);
                                            }}
                                            selected={formik.values.targetUserId === user.id}
                                        />
                                    ))
                                  }
                                </div>
                              </UICardBlock>

                              {formik.values.targetUserId && (<UICardBlock>
                                <h4 className={styles.yesNoHeader}>Include target user to request?
                                  <span>
                                  <UISwitch
                                      name='includeTargetUser'
                                      checked={formik.values.includeTargetUser}
                                      onChange={formik.handleChange}
                                  /></span>
                                </h4>
                                <p>If yes, this user will also receive request</p>
                              </UICardBlock>)
                              }
                              <UICardBlock>
                                <h4 className={styles.yesNoHeader}>Set Deadline for this request?
                                  <span>
                                  <UISwitch
                                      name='withDeadline'
                                      checked={formik.values.withDeadline}
                                      onChange={formik.handleChange}
                                  /></span>
                                </h4>
                                <p>Users will be notified before the deadline</p>

                                {formik.values.withDeadline &&
                                <>
                                  <p className={styles.deadlineDate}>
                                    {formik.values.expirationDate ? formik.values.expirationDate.toLocaleString() : ' '}
                                  </p>
                                  <DatePicker name='expirationDate'
                                              minDate={new Date()}
                                              selected={formik.values.expirationDate}
                                              onChange={date => formik.setFieldValue('expirationDate', date)}
                                              showTimeSelect
                                              inline
                                  />
                                </>
                                }
                              </UICardBlock>

                              <UICardBlock>
                                <h4 className={styles.yesNoHeader}>Notify Users?
                                  <span>
                                  <UISwitch
                                      name='notifyUsers'
                                      checked={formik.values.notifyUsers}
                                      onChange={formik.handleChange}
                                  /></span>
                                </h4>
                                <p>Users will be notified after sending the request</p>
                              </UICardBlock>

                              <UICardBlock>
                                <h4 className={styles.yesNoHeader}>Automatically Generate Report?
                                  <span>
                                  <UISwitch
                                      name='generateReport'
                                      checked={formik.values.generateReport}
                                      onChange={formik.handleChange}
                                  /></span>
                                </h4>
                              </UICardBlock>

                              <UICardBlock>
                                <div className={styles.selectHeader}>
                                  <h4>
                                <span className={[styles.option, selectTeams && styles.selected].join(' ')}
                                      onClick={() => {
                                        if (!selectTeams) {
                                          setSelectTeams(true);
                                          formik.setFieldValue('chosenUsers', []);
                                        }
                                      }}>
                                        Select Teams
                                        </span>
                                    <span className={[styles.option, !selectTeams && styles.selected].join(' ')}
                                          onClick={() => {
                                            if (selectTeams) {
                                              setSelectTeams(false);
                                              formik.setFieldValue('chosenTeams', []);
                                            }
                                          }}>
                                Select Users
                              </span>
                                  </h4>
                                </div>

                                {selectTeams && teams.map(team => (
                                    <UITeamItemCard
                                        key={team.id}
                                        team={team}
                                        selected={formik.values.chosenTeams.includes(team)}
                                        onClick={() => {
                                          let newTeams = [];
                                          if (formik.values.chosenTeams.includes(team)) {
                                            newTeams = formik.values.chosenTeams.filter(t => t !== team);
                                          } else {
                                            newTeams = [...formik.values.chosenTeams, team];
                                          }
                                          formik.setFieldValue('chosenTeams', newTeams);
                                        }}

                                    />
                                ))}
                                {!selectTeams && users.map(user => (
                                    <UIUserItemCard
                                        key={user.id}
                                        avatar={user.avatar}
                                        userInfo={'Username: ' + user.username}
                                        selected={formik.values.chosenUsers.includes(user)}
                                        onClick={() => {
                                          let newUsers = [];
                                          if (formik.values.chosenUsers.includes(user)) {
                                            newUsers = formik.values.chosenUsers.filter(u => u !== user);
                                          } else {
                                            newUsers = [...formik.values.chosenUsers, user];
                                          }
                                          formik.setFieldValue('chosenUsers', newUsers);
                                        }}/>
                                ))}
                              </UICardBlock>

                              <UICardBlock>
                                <UIButton title='Send!' submit/>
                                {error && <Message color='red'>{error}</Message>}

                              </UICardBlock>
                            </form>
                        )}
                    </Formik>
                  </UICard>
                </LoaderWrapper>
              </UIColumn>

            </UIContent>
          </>
      );
    };

interface IRouterProps {
  id: string;
}

const mapStateToProps = (state: IAppState, ownProps: RouteComponentProps) => ({
  domProps: ownProps,
  teams: state.teams.teams,
  isLoadingTeams: state.teams.isLoading,
  users: state.teams.companyUsers,
  isLoadingUsers: state.teams.isLoadingUsers,
  questions: state.questionnaires.current.questions
});

const mapDispatchToProps = {
  loadTeams: loadTeamsRoutine,
  loadUsers: loadCompanyUsersRoutine,
  sendRequest: sendQuestionnaireRequestRoutine,
  loadQuestionnaire: loadOneQuestionnaireRoutine
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConnectedRequestCreationProps = ConnectedProps<typeof connector>;

export default connector(RequestCreation);