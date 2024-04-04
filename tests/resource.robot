*** Settings ***
Library           SeleniumLibrary
Library           DateTime
Library           String
Library           Collections
Library           OperatingSystem

*** Variables ***
${BROWSER}                      Chrome
${SERVER}                       http://localhost:3000

${HOME_URL}                     ${SERVER}/home

# LOGIN 
${EMAIL_LOCATOR}                id:email
${PASSWORD_LOCATOR}             id:password
${VALID_EMAIL}                  endicoco@gmail.com
${VALID_PASSWORD}               test123
${INVALID_EMAIL}                invalidtestemail@gmail.com
${INVALID_PASSWORD}             invalidtestpassword
${LOGIN_BUTTON}                 id:login-submit-btn
${INVALID_LOGIN_MSSG}           id:error-message

# REGISTER 
${REG_NAME_LOCATOR}                     id:register-name
${REG_EMAIL_LOCATOR}                    id:register-email
${REG_PASSWORD_LOCATOR}                 id:register-password
${REG_CONFIRM-PASSWORD_LOCATOR}         id:register-confirm-password
${REG_BUTTON}                           id:register-submit-btn

# BAG
${ADD_MAIN_BUTTON}               id:add-main-btn
${ADD_BAG_BUTTON}                css:div.bot-sec-option-btn
${BAG_COLOR_INPUT}               id:form-bag-bg-red
${BAG_NAME_INPUT}                name:bagname
${BAG_WEIGHT_INPUT}              id:weight
${BAG_DATE_INPUT}                id:date
${BAG_DESC_INPUT}                id:bagdesc
${NEXT_BUTTON}                   id:next-btn
${SUBMIT_BAG_BUTTON}             id:submit-btn
${BAG_PAGE_TITLE}                css:h1.inside-bag-name
${POP_UP_MSG}                    css:h2.swal2-title
${BACK_BUTTON}                   css:div.back
${BAG_NAME}                      bag1
${DISPLAYED_BAG_WEIGHT}          xpath=//div[@class='inside-bag-weight']//p
${DISPLAYED_BAG_DATE}            xpath=//div[@class='inside-bag-sched1']//p

${SETTINGS_BAG_BUTTON}           css:div.inside-bag-edit
${EDIT_BAG_BUTTON}               id:edit-edit-btn
${DELETE_BAG_BUTTON}             id:edit-delete-btn
${SAVE_BAG_BUTTON}               id:save-btn

# ITEM
${ADD_ITEMS_BUTTON}               id:add-item-link
${EDIT_ITEMS_GALL}                xpath=//div[@class='float-btn-btn' and text()='Edit Items Gallery']
${ADD_AN_ITEM_BUTTON}             css:div.gallery-add-item
${ITEM_INPUT}                     id:item
${ITEM_WEIGHT_INPUT}              css:input.itemweight
${SUBMIT_ITEM_BUTTON}             css:button.confirm-btn
${EXIST_ITEM_MSG}                 css:div.swal2-html-container
${ITEM_SETTINGS_BUTTON}           id:item-setting
${DELETE_ITEM_BUTTON}             id:item-move

${WRAPPER}                      xpath=//*[@id="container"]
${BAG_BOX}                      css=.bag-box
${HEADING}                      xpath=//h1[@class="inside-bag-name"]

${HOME_TITLE}                   id:title-bar

${SEARCH_BUTTON}                id:search-bar-icon
${SEARCH_INPUT}                 id:searchBar
${WRAPPER_ID}                   id:container
${BAGS_LIST}                    xpath=//*[@id="container"]//*[@class="bag-name"]

*** Keywords ***
Start
    Open Browser    ${SERVER}    ${BROWSER}

Open Browser in Login Page
    Start
    Click Link     /login

Input Username and Password
    [Arguments]    ${email}    ${password}
    Input Text    ${EMAIL_LOCATOR}    ${email}
    Input Text    ${PASSWORD_LOCATOR}    ${password}

Login As User
    Open Browser in Login Page
    Input Username and Password      ${VALID_EMAIL}        ${VALID_PASSWORD}
    Click Element       ${LOGIN_BUTTON}

Open Browser in Register Page
    Start
    Click Link     /register 

Input Register
    [Arguments]    ${username}     ${email}    ${password}      ${confirm_password}
    Input Text      ${REG_NAME_LOCATOR}    ${username}
    Input Text      ${REG_EMAIL_LOCATOR}    ${email}
    Input Text      ${REG_PASSWORD_LOCATOR}    ${password}
    Input Text      ${REG_CONFIRM-PASSWORD_LOCATOR}     ${confirm_password}     

Retrieve Error Message
    [Arguments]    ${locator}
    Wait Until Element Is Visible    ${locator}    timeout=10s
    ${text}=    Get Text    ${locator}
    RETURN    ${text}

#for register
Generate Random Integer
    [Arguments]    ${min_length}    ${max_length}
    ${rand_int}=    Evaluate    random.randint(${min_length}, ${max_length})
    RETURN    ${rand_int}

Generate Random Name and Email
    ${username_length}=    Generate Random Integer    7    36
    ${username}=    Generate Random String    ${username_length}    [LETTERS]
    ${email}=    Catenate    ${username}    "@"    "gmail.com"
    RETURN    ${email}    ${username}

Create A Bag
    Login As User
    Wait Until Element Is Visible        ${ADD_MAIN_BUTTON}
    Click Element        ${ADD_MAIN_BUTTON}
    Wait Until Element Is Visible        ${ADD_BAG_BUTTON}
    Click Element        ${ADD_BAG_BUTTON}
    Input Text           ${BAG_NAME_INPUT}      ${bag_name}
    Wait Until Element Is Visible       ${BAG_COLOR_INPUT}
    Click Element        ${BAG_COLOR_INPUT}
    Click Element        ${NEXT_BUTTON}
    Wait Until Element Is Visible        ${BAG_DATE_INPUT}
    Click Element        ${SUBMIT_BAG_BUTTON}
    Wait Until Element Is Visible       ${BAG_PAGE_TITLE}

Start Create Bag
    Wait Until Element Is Visible        ${ADD_MAIN_BUTTON}
    Click Element        ${ADD_MAIN_BUTTON}
    Wait Until Element Is Visible        ${ADD_BAG_BUTTON}
    Click Element        ${ADD_BAG_BUTTON}

Start Edit Bag
    Click Element       ${SETTINGS_BAG_BUTTON}
    Wait Until Element Is Visible        ${EDIT_BAG_BUTTON}
    Click Element       ${EDIT_BAG_BUTTON}

Start Delete Bag
    Wait Until Element Is Visible        ${SETTINGS_BAG_BUTTON}
    Click Element       ${SETTINGS_BAG_BUTTON}
    Wait Until Element Is Visible        ${DELETE_BAG_BUTTON}
    Click Element       ${DELETE_BAG_BUTTON}
    Wait Until Element Is Visible       css:div.confirm-box

Start Create Item
    Wait Until Element Is Visible       ${BAG_PAGE_TITLE}
    Wait Until Element Is Visible        ${ADD_MAIN_BUTTON}
    Click Element       ${ADD_MAIN_BUTTON}
    Click Element       ${ADD_ITEMS_BUTTON}
    Wait Until Page Contains Element    ${EDIT_ITEMS_GALL}
    Click Element    ${EDIT_ITEMS_GALL}
    Wait Until Element Is Visible       ${ADD_AN_ITEM_BUTTON}
    Click Element       ${ADD_AN_ITEM_BUTTON}

Start Edit Item
    Wait Until Element Is Visible       ${BAG_PAGE_TITLE}
    Wait Until Element Is Visible        ${ADD_MAIN_BUTTON}
    Click Element       ${ADD_MAIN_BUTTON}
    Click Element       ${ADD_ITEMS_BUTTON}
    Wait Until Page Contains Element    ${EDIT_ITEMS_GALL}
    Click Element    ${EDIT_ITEMS_GALL}

Start Delete Item
    Wait Until Element Is Visible       ${BAG_PAGE_TITLE}
    Wait Until Element Is Visible        ${ADD_MAIN_BUTTON}
    Click Element       ${ADD_MAIN_BUTTON}
    Click Element       ${ADD_ITEMS_BUTTON}
    Wait Until Page Contains Element    ${EDIT_ITEMS_GALL}
    Click Element    ${EDIT_ITEMS_GALL}
    Click Element    ${ITEM_SETTINGS_BUTTON}
    Click Element       ${DELETE_ITEM_BUTTON}
