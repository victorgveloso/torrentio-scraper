const moment = require("moment");
const Bottleneck = require("bottleneck");
const adorocinema = require("./adorocinema_api");
const { Type } = require("../../lib/types");
const repository = require("../../lib/repository");
const Promises = require("../../lib/promises");
const { createTorrentEntry, checkAndUpdateTorrent } = require("../../lib/torrentEntries");
const { updateCurrentSeeders, updateTorrentSize } = require("../../lib/torrent");
const { getImdbId } = require("../../lib/metadata");

const NAME = "AdoroCinema";
const UNTIL_PAGE = 10;
const TYPE_MAPPING = typeMapping();

const limiter = new Bottleneck({ maxConcurrent: 5 });

async function scrape() {
  const scrapeStart = moment();
  const lastScrape = await repository.getProvider({ name: NAME });
  console.log(`[${scrapeStart}] starting ${NAME} scrape...`);

  return scrapeLatestTorrents()
      .then(() => {
        lastScrape.lastScraped = scrapeStart;
        return lastScrape.save();
      })
      .then(() => console.log(`[${moment()}] finished ${NAME} scrape`));
}

async function updateSeeders(torrent) {
  return limiter.schedule(() => adorocinema.torrent(torrent.torrentId));
}


async function scrapeLatestTorrents() {
  const allowedCategories = [
    adorocinema.Categories.MOVIE,
    adorocinema.Categories.TV,
    adorocinema.Categories.DESENHOS
  ];

  return Promises.sequence(
      allowedCategories.map(
          (category) => () => scrapeLatestTorrentsForCategory(category)
      )
  ).then((entries) => entries.reduce((a, b) => a.concat(b), []));
}

async function scrapeLatestTorrentsForCategory(category, page = 1) {
  console.log(`Scrapping ${NAME} ${category} category page ${page}`);
  return adorocinema
      .browse({ category, page })
      .catch((error) => {
        console.warn(`Failed ${NAME} scrapping for [${page}] ${category} due: `, error);
        return Promise.resolve([]);
      })
      .then((torrents) => Promise.all(torrents.map((torrent) => limiter.schedule(() => processEntry(torrent)))))
      .then((resolved) => resolved.length > 0 && page < untilPage(category)
          ? scrapeLatestTorrentsForCategory(category, page + 1)
          : Promise.resolve());
}

async function processEntry(entry) {
  return adorocinema.torrent(entry.torrentId)
      .then(records => Promises.sequence(records.map(record => () => processTorrentRecord(record))))
      .catch(() => undefined);
}

async function processTorrentRecord(foundTorrent) {
  if (await checkAndUpdateTorrent({ provider: NAME, ...foundTorrent })) {
    return foundTorrent;
  }

  if (!foundTorrent.size) {
    await updateTorrentSize(foundTorrent);
  }
  if (!Number.isInteger(foundTorrent.seeders)) {
    await updateCurrentSeeders(foundTorrent);
  }
  if (!foundTorrent.imdbId && TYPE_MAPPING[foundTorrent.category] !== Type.ANIME) {
    const info = { title: foundTorrent.originalName, year: foundTorrent.year };
    foundTorrent.imdbId = await getImdbId(info, TYPE_MAPPING[foundTorrent.category]).catch(() => undefined);
  }

  const torrent = {
    infoHash: foundTorrent.infoHash,
    provider: NAME,
    torrentId: foundTorrent.torrentId,
    title: foundTorrent.title,
    type: TYPE_MAPPING[foundTorrent.category],
    imdbId: foundTorrent.imdbId,
    uploadDate: foundTorrent.uploadDate,
    seeders: foundTorrent.seeders,
    size: foundTorrent.size,
    files: foundTorrent.files,
    languages: foundTorrent.languages
  };
  return createTorrentEntry(torrent);
}

function typeMapping() {
  const mapping = {};
  mapping[adorocinema.Categories.MOVIE] = Type.MOVIE;
  mapping[adorocinema.Categories.TV] = Type.SERIES;
  mapping[adorocinema.Categories.DESENHOS] = Type.SERIES;
  mapping[adorocinema.Categories.ANIME] = Type.ANIME;
  return mapping;
}

function untilPage(category) {
  return UNTIL_PAGE;
}

module.exports = { scrape, updateSeeders, NAME };
