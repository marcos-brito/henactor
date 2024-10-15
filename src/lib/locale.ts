import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';
import { config } from './config';

config.subscribe((config) => locale.set(config.lang));
register('en', () => import('./locale/en.json'));
register('pt-BR', () => import('./locale/pt-BR.json'));
init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
});
