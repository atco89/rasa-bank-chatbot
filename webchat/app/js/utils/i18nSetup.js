const i18n = require('i18next');
const enTranslations = require('./../../../locale/en/translation.json');

// noinspection JSCheckFunctionSignatures
i18n.init(
    {
        fallbackLng: 'en-US',
        lng: 'en-US',
        resources: {
            'en-US': {
                translation: enTranslations
            }
        },
    }
).then();

module.exports = i18n;