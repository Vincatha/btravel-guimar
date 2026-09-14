export default {
  site: (data) => {
    const configured = process.env.SITE_URL || process.env.URL || data.site.url;
    const url = new URL(configured);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('La dirección de la web debe comenzar por https:// o http://');
    }
    return { ...data.site, url: url.origin };
  },
};
