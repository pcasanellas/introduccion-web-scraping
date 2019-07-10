const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");


//Obtener urls desde el archivo
var urls = fs.readFileSync('urls.txt').toString().split("\n");



// Visitamos cada una de las urls.
urls.forEach(function(url) {
	axios.get(url)
	.then(function (response) {
		// Si la respuesta da un código 200...
		if(response.status === 200) {
			const html = response.data;
			const $ = cheerio.load(html);

			// Scrapeamos con cheerio (jQuery) la información que queramos.
			let info = {
				title: $('h1').clone().children().remove().end().text().trim(),
				date: $('#titleYear').text().replace(/[{()}]/g, '').trim(),
				director: $('.plot_summary').find('.credit_summary_item a').first().text().trim(),
				genre: $('#titleStoryLine').find('.see-more.inline.canwrap').last().find('a').text().trim(),
				duration: $('.txt-block time').text().trim(),
			}

			// Lo insertamos en un fichero
			fs.readFile('info.json',  function (err, data) {
				var json = JSON.parse(data)
				json[url] = info
				fs.writeFileSync('info.json', JSON.stringify(json, null, 4))
				console.log(url + ' scraped!')
			});

		}

		return false;
	})
	.catch(function (error) {
		console.log(error);
	});
});