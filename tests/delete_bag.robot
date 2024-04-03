*** Settings ***
Library           SeleniumLibrary
Resource          resource.robot
Suite Teardown      Close Browser

*** Test Cases ***
Bag Deletion Confirmed
    Create A Bag
    Start Delete Bag
    Click Element       id:confirm-ok
    Wait Until Element Is Visible       ${POP_UP_MSG}
    ${text}=    Get Text    ${POP_UP_MSG}
    Should Be Equal As Strings    ${text}    Bag deleted
    Wait Until Element Is Visible       ${HOME_TITLE}
    Page Should Contain Element     ${HOME_TITLE}

Bag Deletion Cancelled
    Create A Bag
    Start Delete Bag
    Click Element       id=confirm-cancel
    ${text}=    Retrieve Error Message    ${HEADING}
    Should Be Equal As Strings    ${text}    ${BAG_NAME}