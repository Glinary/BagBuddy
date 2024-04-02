*** Settings ***
Library           SeleniumLibrary
Resource          resource.robot
Suite Teardown      Close Browser

*** Test Cases ***
Valid Bag Creation All Inputs
    Login As User
    Start Create Bag
    Click Element       ${BAG_COLOR_INPUT}
    Input Text           ${BAG_NAME_INPUT}      ${BAG_NAME}
    Input Text           ${BAG_WEIGHT_INPUT}        5
    Click Element        ${NEXT_BUTTON}
    Wait Until Element Is Visible        ${BAG_DATE_INPUT}
    Input Text      ${BAG_DATE_INPUT}       04-11-2024
    Input Text           ${BAG_DESC_INPUT}     my favorite
    Click Element        ${SUBMIT_BAG_BUTTON}
    ${text}=    Retrieve Error Message    ${POP_UP_MSG}
    Should Be Equal As Strings    ${text}    Bag created
    ${text}=    Retrieve Error Message    ${BAG_PAGE_TITLE}
    Should Be Equal As Strings    ${text}    ${BAG_NAME}

Valid Bag Creation Name Only
    #Login As User
    Click Element       ${BACK_BUTTON}
    Start Create Bag
    Input Text           ${BAG_NAME_INPUT}      ${BAG_NAME}
    Click Element        ${NEXT_BUTTON}
    Wait Until Element Is Visible        ${BAG_DATE_INPUT}
    Click Element        ${SUBMIT_BAG_BUTTON}
    ${text}=    Retrieve Error Message    ${POP_UP_MSG}
    Should Be Equal As Strings    ${text}    Bag created
    ${text}=    Retrieve Error Message    ${BAG_PAGE_TITLE}
    Should Be Equal As Strings    ${text}    ${BAG_NAME}

Invalid Bag Creation No Name
    #Login As User
    Click Element       ${BACK_BUTTON}
    Start Create Bag
    Click Element        ${NEXT_BUTTON}
    Wait Until Element Is Visible        ${BAG_DATE_INPUT}
    Click Element        ${SUBMIT_BAG_BUTTON}
    ${text}=    Retrieve Error Message    ${POP_UP_MSG}
    Should Be Equal As Strings    ${text}    Bag name is required!
    Wait Until Element Is Visible       id:form-add-title
    