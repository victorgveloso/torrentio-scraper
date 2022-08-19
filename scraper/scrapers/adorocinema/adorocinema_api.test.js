const fs = require('fs').promises;
const {
  torrent,
  search,
  browse,
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
  let expected_output = [
    {"name": "O Predador - A Caçada",
    "torrentId": "https://adorocinematorrent.com/o-predador-a-cacada-download/"},
    {name: "Predadores Perigosos - Os Mais Temidos Dos Oceanos - Ocean Predators",
    torrentId: "https://adorocinematorrent.com/predadores-perigosos-os-mais-temidos-dos-oceanos-ocean-predators-download/"},
    {name: "Alien vs. Predador - Sem Cortes",
    torrentId: "https://adorocinematorrent.com/alien-vs-predador-sem-cortes-download/"},
    {name: "Alien vs. Predador 2 - Versão Estendida",
    torrentId: "https://adorocinematorrent.com/alien-vs-predador-2-versao-estendida-download/"},
    {name: "Alien vs. Predador 2",
    torrentId: "https://adorocinematorrent.com/alien-vs-predador-2-download/"},
    {name: "O Predador - Trilogia",
    torrentId: "https://adorocinematorrent.com/o-predador-trilogia-download/"},
    {name: "Patient Zero - A Origem do Vírus",
    torrentId: "https://adorocinematorrent.com/patient-zero-a-origem-do-virus-download/"},
    {name: "Boa vs. Python - As Predadoras",
    torrentId: "https://adorocinematorrent.com/boa-vs-python-as-predadoras-download/"},
    {name: "Instinto Predador",
    torrentId: "https://adorocinematorrent.com/instinto-predador-download/"},
    {name: "Predadores Assassinos Blu-Ray",
    torrentId: "https://adorocinematorrent.com/predadores-assassinos-blu-ray-download/"},
    {name: "O Predador BluRay",
    torrentId: "https://adorocinematorrent.com/o-predador-bluray-download/"},
    {name: "Alien - A Ressurreição",
    torrentId: "https://adorocinematorrent.com/alien-a-ressurreicao-download/"},
    {name: "Predadores Assassinos BluRay",
    torrentId: "https://adorocinematorrent.com/predadores-assassinos-bluray-download/"},
    {name: "Predadores Assassinos",
    torrentId: "https://adorocinematorrent.com/predadores-assassinos-download/"},
    {name: "Predadores Assassinos - Legendado WEB-DL",
    torrentId: "https://adorocinematorrent.com/predadores-assassinos-legendado-web-dl-download/"},
    {name: "Predadores Assassinos - Legendado",
    torrentId: "https://adorocinematorrent.com/predadores-assassinos-legendado-download/"},
    {name: "Predadores Assassinos - CAM - Legendado",
    torrentId: "https://adorocinematorrent.com/predadores-assassinos-cam-legendado-download/"},
    {name: "Predador Ártico",
    torrentId: "https://adorocinematorrent.com/predador-artico-download/"},
    {name: "Predadores Perigosos - Os Mais Temidos Dos Oceanos",
    torrentId: "https://adorocinematorrent.com/predadores-perigosos-os-mais-temidos-dos-oceanos-download/"},
    {name: "Alien - Todos os Filmes (Antologia)",
    torrentId: "https://adorocinematorrent.com/alien-todos-os-filmes-antologia-download/"}
  ];
  
  let result = await search(keyword);
  expect(result).toEqual(expected_output);
});
  
it("browse should fetch one page (summing up 20 torrents)", async () => {
  let result = await browse();
  expect(result).toHaveLength(20);
});
  
it("browse should find all torrents in the frontpage", async () => {
  let expected_output = [
    {name: "Caçando Ava Bravo",
    torrentId: "https://adorocinematorrent.com/cacando-ava-bravo-download/"},
    {name: "365 Dias - Finais",
    torrentId: "https://adorocinematorrent.com/365-dias-finais-download/"},
    {name: "Cuphead - A Série - 2ª Temporada",
    torrentId: "https://adorocinematorrent.com/cuphead-a-serie-2-temporada-download/"},
    {name: "Alma - 1ª Temporada Legendada",
    torrentId: "https://adorocinematorrent.com/alma-1-temporada-legendada-download/"},
    {name: "Kleo - 1ª Temporada Legendada",
    torrentId: "https://adorocinematorrent.com/kleo-1-temporada-legendada-download/"},
    {name: "Echoes - Legendada",
    torrentId: "https://adorocinematorrent.com/echoes-legendada-download/"},
    {name: "Mulher-Hulk - Defensora de Heróis - 1ª Temporada",
    torrentId: "https://adorocinematorrent.com/mulher-hulk-defensora-de-herois-1-temporada-download/"},
    {name: "O Atirador - Missão Secreta",
    torrentId: "https://adorocinematorrent.com/o-atirador-missao-secreta-download/"},
    {name: "Tekken - Bloodline - 1ª Temporada Completa",
    torrentId: "https://adorocinematorrent.com/tekken-bloodline-1-temporada-completa-download/"},
    {name: "As Meninas de Surfside - 1ª Temporada Legendada",
    torrentId: "https://adorocinematorrent.com/as-meninas-de-surfside-1-temporada-legendada-download/"},
    {name: "Órfã 2 - A Origem - Legendado",
    torrentId: "https://adorocinematorrent.com/orfa-2-a-origem-legendado-download/"},
    {name: "Sem Norte",
    torrentId: "https://adorocinematorrent.com/sem-norte-download/"},
    {name: "Royalteen",
    torrentId: "https://adorocinematorrent.com/royalteen-download/"},
    {name: "Snoopy Apresenta - A Escola da Lucy",
    torrentId: "https://adorocinematorrent.com/snoopy-apresenta-a-escola-da-lucy-download/"},
    {name: "Pobre Família Rica, Quando a Sorte Acaba",
    torrentId: "https://adorocinematorrent.com/pobre-familia-rica-quando-a-sorte-acaba-download/"},
    {name: "Cinco Dias no Hospital Memorial - Legendada",
    torrentId: "https://adorocinematorrent.com/cinco-dias-no-hospital-memorial-legendada-download/"},
    {name: "Mal de Família - 1ª Temporada Legendada",
    torrentId: "https://adorocinematorrent.com/mal-de-familia-1-temporada-legendada-download/"},
    {name: "Trying - 3ª Temporada Legendada",
    torrentId: "https://adorocinematorrent.com/trying-3-temporada-legendada-download/"},
    {name: "Dentro da Mente de um Gato - Legendado",
    torrentId: "https://adorocinematorrent.com/dentro-da-mente-de-um-gato-legendado-download/"},
    {name: "O Natal dos Mitchell 2 - A Competição",
    torrentId: "https://adorocinematorrent.com/o-natal-dos-mitchell-2-a-competicao-download/"},
  ];
  let page_content = await fs.readFile("frontpage_response_stub.html",options={encoding:"UTF-8"});
  let result = await browse(config={mock: page_content});
  expect(result).toEqual(expected_output);
});