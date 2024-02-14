var onboardingContent = [
    { welcomeMessage: 'Welcome to', tagline: '' },
    { welcomeMessage: 'Drag and Drop Packing', tagline: 'Pack with fun! Drag and drop items to your bag effortlessly.' },
    { welcomeMessage: 'Weight Distribution Insights', tagline: 'Got weight limits? BagBuddy will track you bag\'s max. capacity for you.' },
    { welcomeMessage: 'Packaging Checklist', tagline: 'Stay organized! Keep track of your items by creating your own checklist.' },
    { welcomeMessage: 'Group Packing', tagline: 'Share your bag! Start packing with BagBuddy\'s collaborative features.' },
    { welcomeMessage: 'Seamless \nCalendar Sync', tagline: 'Got plans? Plan ahead which bag to use in each of your travels!'},
    { welcomeMessage: 'Notifications', tagline: 'Keep forgetting stuff? Receive timely reminedrs from your best BagBuddy!'}
];

var currentIndex = 0;

function updateOnboardingContent() {
    var content = onboardingContent[currentIndex];

    appMessage = document.getElementById('welcome_message');
    appName = document.getElementById('app_name');
    appTagline = document.getElementById('app_tagline');

    // Contents
    appMessage.textContent = content.welcomeMessage;
    appTagline.textContent = content.tagline;

    // Calculate the size of the content and adjust the margin and padding accordingly
    var widthAppMessage = appMessage.offsetWidth;
    var widthAppTagline = appTagline.offsetWidth;

    var paddingValueMessage = (widthAppMessage > 400) ? '5rem' : '4rem';
    var paddingValueTagline = (widthAppTagline > 400) ? '2rem' : '1rem';

    appMessage.style.paddingLeft = paddingValueMessage;
    appMessage.style.paddingRight = paddingValueMessage;

    appTagline.style.paddingLeft = paddingValueTagline;
    appTagline.style.paddingRight = paddingValueTagline;

    // Progress bar update logic
    var progressBarItems = document.querySelectorAll('.progress-bar-placeholder ul li');
    progressBarItems.forEach(function(item, index) {
        if (index === currentIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (currentIndex === 0) {
        appMessage.textContent = content.welcomeMessage;
        appTagline.style.display = 'none';
        appName.style.display = 'block';
    } else {
        appMessage.textContent = content.welcomeMessage;
        appTagline.textContent = content.tagline;
        appName.style.display = 'none';
        appTagline.style.display = 'block';
    }

    currentIndex = (currentIndex + 1) % onboardingContent.length;

}

updateOnboardingContent();

setInterval(updateOnboardingContent, 5000);