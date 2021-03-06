import React, {FC} from 'react';
import Typography from './Typography';
import Input from './Input';
import Button from './Button';
import {Formik} from "formik";
import * as yup from "yup";
import {registerRoutine} from "../../../sagas/auth/routines";
import {connect, ConnectedProps} from "react-redux";
import {Message} from "semantic-ui-react";
import {IAppState} from "../../../models/IAppState";
import {useTranslation} from "react-i18next";

const schema = yup.object().shape({
    companyName: yup
        .string()
        .required("Company name required")
        .min(2, "Company name too short!")
        .max(40, "Company name too long!")
        .matches(/^([a-zA-Z0-9])([ ]?[a-zA-Z0-9])*$/,
            "Company name should not start/end with space, have more than one space in sequence. " +
          "Company name should contain latin letters and numbers"),
    email: yup
        .string()
        .email("Email must be valid")
        .required("Email must be valid"),
    password: yup
        .string()
        .required("Password required")
        .min(8, "Password too short!")
        .max(16, "Password too long!")
        .matches(/^\w[A-Za-z\d!#$%&'*+\-/=?^_`{}]+$/,
            "Password contains at least 8 characters ( letters, digits and !#$%&'*+-/=?^_`{} )"),
    passwordRepeat: yup
        .string()
        .required("Repeat password")
        .oneOf([yup.ref('password')], 'Passwords must match'),
    username: yup
        .string()
        .required("Username required")
        .min(3, "Username too short!")
        .max(20, "Username too long!")
        .matches(/^\w([A-Za-zА-Яа-я\d!#$%&'*+\-/=?^_`])([ ]?[A-Za-zА-Яа-я\d!#$%&'*+\-/=?^_`])*$/,
            "Username must be valid")
});

const SignUpForm: FC<SignUpFormProps & {className: string}> = props => {
    const {signUp, className, error, success, isLoading} = props;
    const [ t ] = useTranslation();

    return (
        <Formik
            initialValues={{email: '', password: '', companyName: '', username: '', passwordRepeat: ''}}
            validationSchema={schema}
            onSubmit={values => {
                signUp({
                    email: values.email,
                    password: values.password,
                    companyName: values.companyName,
                    username: values.username
                });
            }
            }
        >
            {({
                  touched,
                  errors,
                  values,
                  handleChange,
                  handleBlur,
                  handleSubmit
              }) => {
                const errorText = (touched.username && errors.username)
                    || (touched.email && errors.email)
                    || (touched.companyName && errors.companyName)
                    || (touched.password && errors.password)
                    || (touched.passwordRepeat && errors.passwordRepeat)
                    || error;

                return (
                    <form className={className} onSubmit={handleSubmit} autoComplete="off">
                        <Typography fontWeight="bold" variant="h4">{t("Create Account")}</Typography>
                        <Typography variant="body2">{t("or use your email for registration")}</Typography>
                        <Input name="username" placeholder="Username" value={values.username}
                               onChange={handleChange} onBlur={handleBlur}
                        />
                        <Input name="email" placeholder="Email" value={values.email}
                            onChange={handleChange} onBlur={handleBlur}
                        />
                        <Input name="companyName" placeholder="Company" value={values.companyName}
                        onChange={handleChange} onBlur={handleBlur}
                        />
                        <Input name="password" type="password" placeholder="Password" value={values.password}
                               onChange={handleChange} onBlur={handleBlur}
                        />
                        <Input name="passwordRepeat" type="password"
                               placeholder="Confirm password" value={values.passwordRepeat}
                               onChange={handleChange} onBlur={handleBlur}
                        />
                        {
                            errorText && <Message attached="top" error size="tiny" content={t(errorText)}/>
                        }
                        {
                            !errorText && success && <Message attached="top"
                                                positive
                                                content={"Account created!\n Check your email"}/>
                        }
                        <Button disabled={(!!errorText && errorText !== error) || isLoading}
                                variant="secondary"
                                type="submit"
                                marginTop="1.17rem">
                            {t("Sign Up")}
                        </Button>
                    </form>);}}
        </Formik>
    );
};

const mapState = (state: IAppState) => ({
    isLoading: state.user.isLoading,
    error: state.user.error?.register,
    success: state.user.isRegisteredSuccess
});

const mapDispatch = {
    signUp: registerRoutine
};

const connector = connect(mapState, mapDispatch);

type SignUpFormProps = ConnectedProps<typeof connector>;

export default connector(SignUpForm);

