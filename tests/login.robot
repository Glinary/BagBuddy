*** Settings ***
Library           SeleniumLibrary
Resource          resource.robot
Suite Teardown      Close Browser

*** Test Cases ***

Valid User Login
    Login As User

Invalid Password
    Open Browser in Login Page
    Input Username and Password      ${VALID_EMAIL}        ${INVALID_PASSWORD}
    Click Element        ${LOGIN_BUTTON}
    ${text}=        Retrieve Error Message      ${INVALID_LOGIN_MSSG}
    Should Be Equal    ${text}    Incorrect email or password. Please try again.     #Incorrect Credentials

Inexistent user
    Open Browser in Login Page
    Input Username and Password      ${INVALID_EMAIL}        ${VALID_PASSWORD}
    Click Element        ${LOGIN_BUTTON}
    ${text}=        Retrieve Error Message      ${INVALID_LOGIN_MSSG}
    Should Be Equal      ${text}      An error occurred     #Incorrect Credentials

Incomplete Login
    Open Browser in Login Page
    Input Text           ${EMAIL_LOCATOR}        ${VALID_EMAIL}
    Click Element        ${LOGIN_BUTTON}
    ${text}=        Retrieve Error Message      ${INVALID_LOGIN_MSSG}
    Should Be Equal      ${text}      Incorrect email or password. Please try again.        #Missing Credentials