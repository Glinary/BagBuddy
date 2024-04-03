*** Settings ***
Library           SeleniumLibrary
Resource          resource.robot
Suite Teardown      Close Browser

*** Variables ***
${VALID_BAG_NAME}     123     #replace with any existing bag name   

*** Test Cases ***
Valid Search
    Login As User
    Wait Until Element Is Visible        ${HOME_TITLE}
    Click Element       ${SEARCH_BUTTON}
    Input Text          ${SEARCH_INPUT}     ${VALID_BAG_NAME}
    Wait Until Element Is Visible    ${WRAPPER_ID}    timeout=10s
    Sleep       7s
    ${bag_names}=    Get WebElements    ${BAGS_LIST}
    FOR    ${element}    IN    @{bag_names}
        ${bag_name}=    Get Text    ${element}
        Run Keyword If    not "${VALID_BAG_NAME}" in "${bag_name}"    Fail    Bag name "${bag_name}" does not contain "${VALID_BAG_NAME}"
    END

Invalid Search
    Login As User
    Wait Until Element Is Visible    ${HOME_TITLE}
    Click Element    ${SEARCH_BUTTON}
    Input Text    ${SEARCH_INPUT}    Nothing
    Wait Until Element Is Visible    ${WRAPPER_ID}    timeout=10s
    Sleep    7s
    ${bag_names}=    Get WebElements    ${BAGS_LIST}
    Should Be Empty    ${bag_names}

