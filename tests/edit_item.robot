*** Settings ***
Library           SeleniumLibrary
Resource          resource.robot
Suite Teardown      Close Browser

*** Variables ***
${exist_item}     pen       #replace w/ existin item name     

*** Test Cases ***
Valid Item Edit Name
    Create A Bag
    Start Edit Item
    Wait Until Element Is Visible       ${ADD_AN_ITEM_BUTTON}
    ${item}=    Generate Random String    5    [LETTERS]        #should not be existing item
    Click Element    ${ITEM_SETTINGS_BUTTON}
    Input Text      ${ITEM_INPUT}     ${item}
    Click Element       ${SUBMIT_ITEM_BUTTON}
    ${text}=    Retrieve Error Message    ${POP_UP_MSG}
    Should Be Equal As Strings    ${text}    Item/s have been updated

Valid Item Edit Weight
    Create A Bag
    Start Edit Item
    Click Element    ${ITEM_SETTINGS_BUTTON}
    Input Text      name:itemweight       4
    Click Element       ${SUBMIT_ITEM_BUTTON}
    ${text}=    Retrieve Error Message    ${POP_UP_MSG}
    Should Be Equal As Strings    ${text}    Item/s have been updated

#Invalid Item Edit Name
#    Create A Bag
#    Start Edit Item
#    Wait Until Element Is Visible       ${ADD_AN_ITEM_BUTTON}
#    Click Element    ${ITEM_SETTINGS_BUTTON}
#    Input Text      ${ITEM_INPUT}     ${exist_item}
#    Click Element       ${SUBMIT_ITEM_BUTTON}
#    ${text}=    Retrieve Error Message    ${POP_UP_MSG}
#    Should Be Equal As Strings    ${text}    ${exist_item} is already existing in your gallery

    

