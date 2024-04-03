*** Settings ***
Library           SeleniumLibrary
Resource          resource.robot
Suite Teardown      Close Browser

*** Test Cases ***
Valid Item Creation
    Create A Bag
    Start Create Item
    ${item}=    Generate Random String    5    [LETTERS]        #should not be existing item
    Input Text      ${ITEM_INPUT}     ${item}
    Input Text      ${ITEM_WEIGHT_INPUT}       1
    Click Element       ${SUBMIT_ITEM_BUTTON}
    ${text}=    Retrieve Error Message    ${POP_UP_MSG}
    Should Be Equal As Strings    ${text}    Item/s has been added

Invalid Item Creation
    Create A Bag
    Start Create Item
    Input Text      ${ITEM_INPUT}     Water
    Input Text      ${ITEM_WEIGHT_INPUT}       1
    Click Element       ${SUBMIT_ITEM_BUTTON}
    Wait Until Element Is Visible       ${POP_UP_MSG}
    Input Text      ${ITEM_INPUT}     Water               #add existing item name
    Input Text      ${ITEM_WEIGHT_INPUT}       1
    Execute JavaScript    document.querySelector('.confirm-btn').click()
    ${text}=    Retrieve Error Message    ${EXIST_ITEM_MSG}
    Should Be Equal As Strings    ${text}    Water is already existing in your gallery
