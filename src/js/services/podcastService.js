//var parser = RSSParser;
ngApp.factory('podcastService', ['parseRssService', '$http', '$q', function (parseRssService, $http, $q) {
    //var parser = Parser;//require('rss-parser');

    var podcastData = localStorage.getItem('podcasts') || [];

    var subscribeToPodcast = (url) => {
        return $q((resolve, reject) => {
            console.info("Grabbing Podcast Info...",url);
            $http.get(url).then((resp) => {

                try {
                    console.info("Podcast Response -> ", resp);

                    var parsedData = parseRssService.parse(resp.data);

                    console.log("JSON Array -> ", parsedData);

                    var saveInfo = {
                        author: parsedData.rss.channel.author.__text,
                        description: parsedData.rss.channel.summary.__text,
                        thumbnail: parsedData.rss.channel.thumbnail._url,
                        title: parsedData.rss.channel.title,
                        items: parsedData.rss.channel.item.slice(0, 10),
                        url: url,
                        id: _.camelCase(parsedData.rss.channel.title)
                    };

                    console.log("Saving info -> ", saveInfo);

                    var podcasts = JSON.parse(localStorage.getItem('podcasts')) || [];

                    var updateIndex = _.findIndex(podcasts, (item) => {
                        if(item.id === saveInfo.id) {
                            return item;
                        }
                    });

                    if(updateIndex === -1) {
                        podcasts.push(saveInfo);
                    } else {
                        podcasts[updateIndex] = saveInfo;
                    }

                    podcasts = JSON.stringify(podcasts);

                    localStorage.setItem('podcasts', podcasts);

                    resolve(saveInfo);
                } catch (e) {
                    console.error("Error -> ",e);
                    reject(e);
                }
            }).catch((resp) => {
                console.warn("Failed to subscribe",resp);
                reject(resp);
            })
        });
    };

    return {
        subscribe: subscribeToPodcast
    };
}]);