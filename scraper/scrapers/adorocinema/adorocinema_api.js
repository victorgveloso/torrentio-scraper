const axios = require('axios');
const cheerio = require("cheerio");
const decode = require('magnet-uri');
const { escapeHTML } = require('../../lib/metadata');
const { getRandomUserAgent } = require('../../lib/requestHelper');
const { isPtDubbed, sanitizePtName, sanitizePtOriginalName, sanitizePtLanguages } = require('../scraperHelper')

const defaultTimeout = 30000;
const maxSearchPage = 50

const baseUrl = 'https://adorocinema.com';

const Categories = {
  MOVIE: 'filmes',
  TV: 'series',
  ANIME: 'anime',
  DESENHOS: 'desenhos'
};

/**
 * Fetch info of a single torrent
 * 
 * @param {string} torrentId The content detail page's URI to parse
 * @param {object} config Custom settings (page, timeout, category)
 * @param {number} retries Number of retries (default = 2) 
 * @returns Parse content detail page and extract all info available
 */
function torrent(torrentId, config = {}, retries = 2) {
  if (!torrentId || retries === 0) {
    return Promise.reject(new Error(`Failed ${torrentId} query`));
  }
  const slug = encodeURIComponent(torrentId.split("/")[3]);
  return singleRequest(`${baseUrl}/${slug}/`, config)
      .then((body) => parseTorrentPage(body))
      .then((torrent) => torrent.map(el => ({ torrentId: slug, ...el })))
      .catch((err) => {
        console.warn(`Failed AdoroCinema ${slug} request: `, err);
        return torrent(torrentId, config, retries - 1)
      });
}

/**
 * Search for content title and extract results' info
 * 
 * @param {string} keyword Search query
 * @param {object} config Custom settings
 * @param {number} retries Number of retries
 * @returns List of extracted info from content detail pages
 */
function search(keyword, config = {}, retries = 2) {
  if (!keyword || retries === 0) {
    return Promise.reject(new Error(`Failed ${keyword} search`));
  }
  const page = config.page || 1;
  const extendToPage = Math.min(maxSearchPage, (config.extendToPage || 1))

  return singleRequest(`${baseUrl}/${keyword}/${page}/`, config)
      .then(body => parseTableBody(body))
      .then(torrents => torrents.length === 40 && page < extendToPage
          ? search(keyword, { ...config, page: page + 1 }).catch(() => [])
              .then(nextTorrents => torrents.concat(nextTorrents))
          : torrents)
      .catch((err) => search(keyword, config, retries - 1));
}
/**
 * Browse latest posts and extract detail page URIs
 * 
 * @param {object} config Custom settings (page, timeout, category)
 * @param {number} retries Number of retries (default = 2) 
 * @returns a list of torrentPages' URI
 */
function browse(config = {}, retries = 2) {
  if (retries === 0) {
    return Promise.reject(new Error(`Failed browse request`));
  }
  const page = config.page || 1;
  const category = config.category;
  const requestUrl = category ? `${baseUrl}/${category}/${page}/` : `${baseUrl}/${page}/`;

  return singleRequest(requestUrl, config)
      .then((body) => parseTableBody(body))
      .catch((err) => browse(config, retries - 1));
}

function singleRequest(requestUrl, config = {}) {
  const timeout = config.timeout || defaultTimeout;
  const options = { headers: { 'User-Agent': getRandomUserAgent() }, timeout: timeout };

  return axios.get(requestUrl, options)
      .then((response) => {
        const body = response.data;
        if (!body) {
          throw new Error(`No body: ${requestUrl}`);
        } else if (body.includes('502: Bad gateway') ||
            body.includes('403 Forbidden')) {
          throw new Error(`Invalid body contents: ${requestUrl}`);
        }
        return body;
      })
      .catch(error => Promise.reject(error.message || error));
}

/**
 * Parse a content list page and search for torrents' URI
 * 
 * @param {string} body The page's source code
 * @returns All torrents' URI found in the provided page
 */
function parseTableBody(body) {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(body);

    if (!$) {
      reject(new Error('Failed loading body'));
    }

    const torrents = [];

    $('div.capa_larga.align-middle').each((i, element) => {
      const row = $(element);
      torrents.push({
        name: row.find("a").text(),
        torrentId: row.find("a").attr("href")
      });
    });
    resolve(torrents);
  });
}


/**
 * Parse a content page and search for torrent info
 * 
 * @param {string} body The page's source code
 * @returns All torrents' info found in the provided page
 */
function parseTorrentPage(body) {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(body);

    if (!$) {
      reject(new Error('Failed loading body'));
    }
    const magnets = $(`a[href^="magnet"]`)
        .filter((i, elem) => isPtDubbed($(elem).attr('title')))
        .map((i, elem) => $(elem).attr("href")).get();
    const details = $('div#informacoes')
    const category = details.find('span:contains(\'Gêneros: \')').next().html()
    const torrents = magnets.map(magnetLink => {
      const decodedMagnet = decode(magnetLink);
      const name = sanitizePtName(escapeHTML(decodedMagnet.name || '').replace(/\+/g, ' '));
      const originalTitle = details.find('span:contains(\'Título Original: \')').next().text().trim();
      const year = details.find('span:contains(\'Ano de Lançamento: \')').next().text().trim();
      const fallBackTitle = `${originalTitle.trim()} ${year.trim()} ${name.trim()}`;
      return {
        title: name.length > 5 ? name : fallBackTitle,
        originalName: sanitizePtOriginalName(originalTitle),
        year: year,
        infoHash: decodedMagnet.infoHash,
        magnetLink: magnetLink,
        category: parseCategory(category),
        uploadDate: new Date($('time').attr('datetime')),
        languages: sanitizePtLanguages(details.find('span:contains(\'Idioma\')').next().text())
      }
    });
    resolve(torrents.filter((x) => x));
  });
}

function parseCategory(body) {
  const $ = cheerio.load(body)
  if ($("a[href*='anime']").text()) {
    return Categories.ANIME
  }
  if ($("a[href*='series']").text()) {
    return Categories.TV
  }
  if ($("a[href*='filmes']").text()) {
    return Categories.MOVIE
  }
  if ($("a[href*='desenhos']").text()) {
    return Categories.TV
  }
}

module.exports = { torrent, search, browse, Categories };