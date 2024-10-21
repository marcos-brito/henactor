import { waitLocale, register, init, getLocaleFromNavigator, dictionary as _dictionary, locale as _locale } from 'svelte-i18n';
import { fromStore, } from 'svelte/store';

export const locale = fromStore(_locale);
export const dictionary = fromStore(_dictionary);

register('en', () => import('./locale/en.json'));
register('pt-BR', () => import('./locale/pt-BR.json'));
init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
});

waitLocale().catch((e) => console.log(`error loading locales: ${e}`));
