*** Settings ***
Library           SeleniumLibrary
Resource          resource.robot
Suite Teardown      Close Browser

*** Test Cases ***
Valid Bag Edit Change Color
    Create A Bag
    Start Edit Bag
    Click Element       id:form-bag-bg-green
    Click Element        ${NEXT_BUTTON}
    Wait Until Element Is Visible        ${BAG_DATE_INPUT}
    Click Element        ${SAVE_BAG_BUTTON}
    Wait Until Element Is Visible       ${HEADING}
    ${color_attribute} =    Execute JavaScript    return window.getComputedStyle(document.querySelector('svg[fill="#1F4F24"]')).fill
    Should Be Equal As Strings    ${color_attribute}    rgb(31, 79, 36)  #this is the equivalent of #1F4F24






Valid Bag Edit Name
    Create A Bag
    Start Edit Bag
    Input Text           ${BAG_NAME_INPUT}        newName
    Click Element        ${NEXT_BUTTON}
    Wait Until Element Is Visible        ${BAG_DATE_INPUT}
    Click Element        ${SAVE_BAG_BUTTON}
    ${text}=    Retrieve Error Message    ${HEADING}
    Should Be Equal As Strings    ${text}    newName

Valid Bag Edit Weight
    Create A Bag
    Start Edit Bag
    Input Text           name:weight        5
    Click Element        ${NEXT_BUTTON}
    Wait Until Element Is Visible        ${BAG_DATE_INPUT}
    Click Element        ${SAVE_BAG_BUTTON}
    ${text}=    Retrieve Error Message    ${DISPLAYED_BAG_WEIGHT}
    Should Be Equal    ${text}    Max: 5

Valid Bag Edit Date
    Create A Bag
    Start Edit Bag
    Click Element        ${NEXT_BUTTON}
    Wait Until Element Is Visible        ${BAG_DATE_INPUT}
    Input Text      ${BAG_DATE_INPUT}       06-01-2025
    Click Element        ${SAVE_BAG_BUTTON}
    Sleep       1s
    Wait Until Element Is Visible    ${DISPLAYED_BAG_DATE}
    ${text}=    Get Text    ${DISPLAYED_BAG_DATE}
    Should Be Equal    ${text}    June 1, 2025

Valid Bag Edit No Date
    Start Edit Bag
    Click Element        ${NEXT_BUTTON}
    Wait Until Element Is Visible        ${BAG_DATE_INPUT}
    Clear Element Text    ${BAG_DATE_INPUT}
    Click Element        ${SAVE_BAG_BUTTON}
    Wait Until Element Is Visible    ${DISPLAYED_BAG_DATE}
    ${text}=    Get Text    ${DISPLAYED_BAG_DATE}
    Should Be Equal    ${text}    Not Scheduled

Invalid Bag Edit No Name
    Create A Bag
    Start Edit Bag
    Clear Element Text           ${BAG_NAME_INPUT}        
    Click Element        ${NEXT_BUTTON}
    Wait Until Element Is Visible        ${BAG_DATE_INPUT}
    Click Element        ${SAVE_BAG_BUTTON}
    ${text}=    Retrieve Error Message    ${POP_UP_MSG}
    Should Be Equal As Strings    ${text}    Bag name is required!
    Wait Until Element Is Visible       id:form-add-title




