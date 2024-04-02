*** Settings ***
Library           SeleniumLibrary
Resource          resource.robot
Suite Teardown      Close Browser

*** Test Cases ***
Item Deletion Confirmed
    Create A Bag
    Start Delete Item
    Wait Until Page Contains Element        swal2-html-container
    Click Element       css:button.swal2-confirm
    Wait Until Element Contains    ${POP_UP_MSG}    Item has been deleted
    
Item Deletion Cancelled
    Create A Bag
    Start Delete Item
    Wait Until Page Contains Element        swal2-html-container
    Click Element       css:button.swal2-cancel
    Wait Until Page Contains Element        css:div.white-wrap-title    #back to item gallery