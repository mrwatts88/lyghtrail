export const STAGES = {
    'staging': {
        VITE_CLERK_PUBLISHABLE_KEY: "pk_test_ZW5nYWdpbmctbWFja2VyZWwtODAuY2xlcmsuYWNjb3VudHMuZGV2JA"
    },
    'production': {
        VITE_CLERK_PUBLISHABLE_KEY: "pk_live_Y2xlcmsubHlnaHRyYWlsLmNvbSQ"
    }
}

export const getStageEnv = () => {
    let stage = 'staging';

    const currentUrl = window.location.href;

    if (currentUrl.includes('lyghtrail.com')) {
        stage = 'production';
    }

    return STAGES[stage]
}
