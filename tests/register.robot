*** Settings ***
Library           SeleniumLibrary
Resource          resource.robot
Suite Teardown      Close Browser

*** Variables ***
${EXIST_USERNAME}      testname         #replace w/ any existing username
${INVALID_EMAIL}      invalidemail.com

*** Test Cases ***

Valid Register
    Open Browser in Register Page
    ${email}    ${username}=    Generate Random Name and Email      #unique for every test run
    Input Register      ${username}        ${email}      testing        testing
    Click element       ${REG_BUTTON}
    Wait Until Element Is Visible    ${HOME_TITLE}

Invalid Username Existing
    Open Browser in Register Page
    Input Register      ${EXIST_USERNAME}        ${VALID_EMAIL}      ${VALID_PASSWORD}      ${VALID_PASSWORD}
    Click element       ${REG_BUTTON}
    ${text}=        Retrieve Error Message     id:register-name-feedback
    Should Be Equal      ${text}      Name already in use.

Invalid Email Existing
    Open Browser in Register Page
    Input Register      ${EXIST_USERNAME}        ${VALID_EMAIL}      ${VALID_PASSWORD}      ${VALID_PASSWORD}
    Click element       ${REG_BUTTON}
    ${text}=        Retrieve Error Message     id:register-email-feedback
    Should Be Equal      ${text}      Email already in use.

Invalid Email Input
    Open Browser in Register Page
    Input Register      ${EXIST_USERNAME}        ${INVALID_EMAIL}      ${VALID_PASSWORD}        ${VALID_PASSWORD}
    Click element       ${REG_BUTTON}
    ${text}=        Retrieve Error Message     id:register-email-feedback
    Should Be Equal      ${text}      Please enter a valid email.


