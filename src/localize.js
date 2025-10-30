const languages = {
    en: {
        card: {
            name: 'SugarTV Card',
            description:
                'A custom lovelace card for Home Assistant that provides a better way to display Dexcom data.',
        },
        editor: {
            glucose_value: 'Glucose value entity (required)',
            glucose_trend: 'Glucose trend entity (required)',
            show_prediction: 'Show prediction',
            unit_override: 'Unit override',
            thresholds: 'Thresholds',
            high_warn: 'High warn',
            high_crit: 'High critical',
            low_warn: 'Low warn',
            low_crit: 'Low critical',
            colors: 'Colors',
            normal_bg: 'Normal background',
            normal_text: 'Normal text color',
            warn_bg: 'Warn background',
            warn_text: 'Warn text color',
            crit_bg: 'Critical background',
            crit_text: 'Critical text color',
        },
        units: {
            mgdl: 'mg/dL',
            mmoll: 'mmol/L',
            auto: 'Auto (from sensor)',
        },
        predictions: {
            rise_over: 'Expected to rise over {0} {1} in 15 minutes',
            rise_in: 'Expected to rise {0} {1} in 15 minutes',
            fall_over: 'Expected to fall over {0} {1} in 15 minutes',
            fall_in: 'Expected to fall {0} {1} in 15 minutes',
        },
        common: {
            not_available: 'N/A',
            default_time: '00:00',
        },
    },
    ru: {
        card: {
            name: 'Карточка SugarTV',
            description:
                'Карточка для Home Assistant, которая предоставляет лучший способ отображения данных Dexcom.',
        },
        editor: {
            glucose_value: 'Значение глюкозы (обязательно)',
            glucose_trend: 'Тренд глюкозы (обязательно)',
            show_prediction: 'Показывать прогноз?',
            unit_override: 'Переопределение единиц',
            thresholds: 'Пороги',
            high_warn: 'Высокий предупреждение',
            high_crit: 'Высокий критический',
            low_warn: 'Низкий предупреждение',
            low_crit: 'Низкий критический',
            colors: 'Цвета',
            normal_bg: 'Фон (норм.)',
            normal_text: 'Текст (норм.)',
            warn_bg: 'Фон (пред.)',
            warn_text: 'Текст (пред.)',
            crit_bg: 'Фон (крит.)',
            crit_text: 'Текст (крит.)',
        },
        units: {
            mgdl: 'мг/дл',
            mmoll: 'ммоль/л',
            auto: 'Авто (с датчика)',
        },
        predictions: {
            rise_over:
                'Ожидается подъем более чем на {0} {1} в течение 15 минут',
            rise_in: 'Ожидается подъем на {0} {1} в течение 15 минут',
            fall_over:
                'Ожидается падение более чем на {0} {1} в течение 15 минут',
            fall_in: 'Ожидается падение на {0} {1} в течение 15 минут',
        },
        common: {
            not_available: 'Н/Д',
            default_time: '00:00',
        },
    },
};

export function getLocalizer(config, hass) {
    const lang = (config && config.locale) || (hass && hass.language) || 'en';
    const lang_code = lang.split('-')[0];

    return function (string, ...args) {
        let translated;
        try {
            translated = string
                .split('.')
                .reduce((o, i) => o[i], languages[lang_code]);
        } catch (e) {
            // do nothing
        }

        if (!translated) {
            try {
                translated = string
                    .split('.')
                    .reduce((o, i) => o[i], languages.en);
            } catch (e) {
                // do nothing
            }
        }

        if (translated && args.length > 0) {
            args.forEach((arg, index) => {
                translated = translated.replace(`{${index}}`, arg);
            });
        }

        return translated || string;
    };
}
