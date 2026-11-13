// GitHub Pages serves the site from the root of its custom domain, so there is no basePath.
export const basePath: string = '';
export const siteUrl = 'https://atticapro.gr';

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
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=%CE%9B.%20%CE%A3%CF%85%CE%B3%CE%B3%CF%81%CE%BF%CF%8D%20196%2C%20%CE%9A%CE%B1%CE%BB%CE%BB%CE%B9%CE%B8%CE%AD%CE%B1',
  whatsappHref: 'https://wa.me/306933347282',
  viberHref: 'viber://chat?number=%2B306933347282',
  email: 'info@atticapro.gr',
  formEndpoint: 'https://api.web3forms.com/submit',
  formAccessKey: 'e12b70fd-061c-406e-8993-0da5a2609674',
  social: {
    facebook: 'https://www.facebook.com/people/AtticaPro/61596532980734/',
    instagram: 'https://instagram.com',
  },
};
