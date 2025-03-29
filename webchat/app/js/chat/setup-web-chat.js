import i18n from './../utils/i18nSetup';

const setupWebChat = environment => {
    const script = document.createElement('script');
    const head = document.head || document.getElementsByTagName('head')[0];

    // noinspection JSUnresolvedVariable
    script.src = "https://cdn.jsdelivr.net/npm/rasa-webchat@1.0.1/lib/index.js";
    script.async = true;

    script.onload = () => {
        // noinspection JSUnresolvedVariable
        if (window.WebChat && typeof window.WebChat.default === 'function') {
            const formatTime = timestamp => {
                const date = new Date(timestamp);
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            };

            // noinspection JSCheckFunctionSignatures
            window.WebChat.default({
                initPayload: '/session_start',
                socketUrl: environment.domain,
                socketPath: '/socket.io/',
                customData: {language: 'en'},
                title: i18n.t('title'),
                inputTextFieldHint: i18n.t('inputHint'),
                connectingText: i18n.t('loadingText'),
                displayUnreadCount: true,
                selector: '#webchat',
                showMessageDate: formatTime,
                profileAvatar: `${environment.public}/images/avatar.png`,
                openLauncherImage: `${environment.public}/images/avatar.png`,
                closeLauncherImage: `${environment.public}/images/avatar.png`,
            });
        }
    };

    head.insertBefore(script, head.firstChild);
    window.localStorage.setItem('chat_session', '');
    window.localStorage.setItem('webchat', '');
};

export default setupWebChat;