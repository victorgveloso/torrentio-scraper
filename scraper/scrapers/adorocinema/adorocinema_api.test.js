const fs = require('fs').promises;
const {
  torrent,
  search,
  browse,
  Categories,
  parseTorrentPage
} = require("./adorocinema_api");

it("parseTorrentPage should parse a valid single torrent page in HTML format", async () => {
  let expected_output = [{
    "title": "O Predador - A Caçada 2022 WEB-DL 1080p DUAL 5.1",
    "originalName": "O Predador - A Caçada",
    "year": "2022",
    "infoHash": "ad08a76141a3e2d7906aaf1319988896564d7eb8",
    "magnetLink": "magnet:?xt=urn:btih:VUEKOYKBUPRNPEDKV4JRTGEISZLE27VY&dn=VACATORRENT.COM..MKV.O%20Predador%20-%20A%20Ca%C3%A7ada%202022%20WEB-DL%201080p%20DUAL%205.1&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce",
    "category": "filmes",
    "uploadDate": new Date("2022-08-18T08:59:48.000Z"),
    "languages": "Português / Inglês"
  }, {
    "title": "O.Predador.A.Cacada.2022.WEB-DL.2160p.HDR-U.V2.EAC3.5.1.Dual-www.animestotais.xyz",
    "originalName": "O Predador - A Caçada",
    "year": "2022",
    "infoHash": "a5546f7bfbf8ea20d360057b69dc3790ba33bb46",
    "magnetLink": "magnet:?xt=urn:btih:UVKG66737DVCBU3AAV5WTXBXSC5DHO2G&dn=VACATORRENT.COM..MKV.O.Predador.A.Cacada.2022.WEB-DL.2160p.HDR-U.V2.EAC3.5.1.Dual-www.animestotais.xyz&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce",
    "category": "filmes",
    "uploadDate": new Date("2022-08-18T08:59:48.000Z"),
    "languages": "Português / Inglês"
  }];
  let result = parseTorrentPage(await fs.readFile("api_response_stub.html"));
  expect(result).resolves.toEqual(expected_output);
});
  
it("torrent should fetch and parse a single torrent page from a specified URL", async () => {
  let expected_output = [{
    "title": "O Predador - A Caçada 2022 WEB-DL 1080p DUAL 5.1",
    "originalName": "O Predador - A Caçada",
    "year": "2022",
    "infoHash": "ad08a76141a3e2d7906aaf1319988896564d7eb8",
    "magnetLink": "magnet:?xt=urn:btih:VUEKOYKBUPRNPEDKV4JRTGEISZLE27VY&dn=VACATORRENT.COM..MKV.O%20Predador%20-%20A%20Ca%C3%A7ada%202022%20WEB-DL%201080p%20DUAL%205.1&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce",
    "category": "filmes",
    "torrentId": "o-predador-a-cacada-download",
    "uploadDate": new Date("2022-08-18T08:59:48.000Z"),
    "languages": "Português / Inglês"
  }, {
    "title": "O.Predador.A.Cacada.2022.WEB-DL.2160p.HDR-U.V2.EAC3.5.1.Dual-www.animestotais.xyz",
    "originalName": "O Predador - A Caçada",
    "year": "2022",
    "infoHash": "a5546f7bfbf8ea20d360057b69dc3790ba33bb46",
    "magnetLink": "magnet:?xt=urn:btih:UVKG66737DVCBU3AAV5WTXBXSC5DHO2G&dn=VACATORRENT.COM..MKV.O.Predador.A.Cacada.2022.WEB-DL.2160p.HDR-U.V2.EAC3.5.1.Dual-www.animestotais.xyz&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce",
    "category": "filmes",
    "torrentId": "o-predador-a-cacada-download",
    "uploadDate": new Date("2022-08-18T08:59:48.000Z"),
    "languages": "Português / Inglês"
  }];
  let result = await torrent("https://adorocinematorrent.com/o-predador-a-cacada-download/");
  expect(result).toEqual(expected_output);
});
  
it("search should find all sigle torrent pages whose title includes the specified keyword", async () => {
  let keyword = "predador";
  let expected_output = ["https://adorocinematorrent.com/o-predador-a-cacada-download/",
  "https://adorocinematorrent.com/predadores-perigosos-os-mais-temidos-dos-oceanos-ocean-predators-download/",
  "https://adorocinematorrent.com/alien-vs-predador-sem-cortes-download/",
  "https://adorocinematorrent.com/alien-vs-predador-2-versao-estendida-download/",
  "https://adorocinematorrent.com/alien-vs-predador-2-download/",
  "https://adorocinematorrent.com/o-predador-trilogia-download/",
  "https://adorocinematorrent.com/patient-zero-a-origem-do-virus-download/",
  "https://adorocinematorrent.com/boa-vs-python-as-predadoras-download/",
  "https://adorocinematorrent.com/instinto-predador-download/",
  "https://adorocinematorrent.com/predadores-assassinos-blu-ray-download/",
  "https://adorocinematorrent.com/o-predador-bluray-download/",
  "https://adorocinematorrent.com/alien-a-ressurreicao-download/",
  "https://adorocinematorrent.com/predadores-assassinos-bluray-download/",
  "https://adorocinematorrent.com/predadores-assassinos-download/",
  "https://adorocinematorrent.com/predadores-assassinos-legendado-web-dl-download/",
  "https://adorocinematorrent.com/predadores-assassinos-legendado-download/",
  "https://adorocinematorrent.com/predadores-assassinos-cam-legendado-download/",
  "https://adorocinematorrent.com/predador-artico-download/",
  "https://adorocinematorrent.com/predadores-perigosos-os-mais-temidos-dos-oceanos-download/",
  "https://adorocinematorrent.com/alien-todos-os-filmes-antologia-download/"];
  
  let result = await search(keyword);
  expect(result).toEqual(expected_output);
});