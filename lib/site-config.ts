// GitHub Pages serves the site from the root of its custom domain, so there is no basePath.
export const basePath: string = '';
export const siteUrl = 'https://attica.pro';

/**
 * next/image with `unoptimized: true` doesn't auto-prefix basePath onto raw
 * string `src` values (unlike next/link or the default image loader), so
 * every local image src needs to go through this.
 */
export function assetPath(path: string) {
  return `${basePath}${path}`;
}

export const siteConfig = {
  name: 'AtticaPro',
  phoneDisplay: '693 334 7282',
  phoneHref: 'tel:+306933347282',
  landlineDisplay: '210 254 5395',
  landlineHref: 'tel:+302102545395',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=%CE%9A%CE%B5%CF%81%CE%BA%CF%8D%CF%81%CE%B1%CF%82%20140%2C%20%CE%91%CE%B8%CE%AE%CE%BD%CE%B1',
  whatsappHref: 'https://wa.me/306933347282',
  viberHref: 'viber://chat?number=%2B306933347282',
  email: 'info@atticapro.gr',
  formEndpoint: 'https://api.web3forms.com/submit',
  formAccessKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
  },
};
