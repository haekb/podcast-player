//var parser = RSSParser;
ngApp.factory('podcastService', ['parseRssService', '$http', '$q', function (parseRssService, $http, $q) {
    //var parser = Parser;//require('rss-parser');

    var podcastData = localStorage.getItem('podcasts') || [];

    var _podcastModel = () => {
        return {
            author: '',
            description: '',
            thumbnail: '',
            title: '',
            items: [],
            url: '',
            id: -1
        };
    };

    var subscribeToPodcast = (url) => {
        return $q((resolve, reject) => {
            console.info("Grabbing Podcast Info...",url);
            $http.get(url).then((resp) => {

                try {
                    console.info("Podcast Response -> ", resp);

                    var parsedData = parseRssService.parse(resp.data);

                    console.log("JSON Array -> ", parsedData);

                    parsedData.rss.channel.url = url;

                    var saveInfo = _applyData(parsedData.rss.channel);

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

    // There's a bunch of different podcast rss specs, so we'll just try and stick with itunes + 2.0.
    var _applyData = (data) => {
        var model = _podcastModel();

        model.author = _returnIfDefined([data.author.__text, data.author]);
        model.description = _returnIfDefined([data.summary.__text, data.description]);
        model.thumbnail = _findThumbnail(data.image);
        model.title = _returnIfDefined(data.title);
        model.items = data.item.slice(0,10);
        model.url = data.url;
        model.id = _.camelCase(model.title);

        return model;
    };

    // If they have multiple covers we'll have to loop through them. Ugh!
    var _findThumbnail = (data) => {
        if(Array.isArray(data)) {

            // We'll just look for itunes here
            data = _.find(data, (_item) => {
                return !_.isUndefined(_item._href);
            });

            return data._href;
        }

        // Okay phew, all good here. Look for itunes or default
        return _returnIfDefined([data._href, data._url]);
    };

    // If you pass an array it'll loop through the values and return the first defined item
    // If you pass a string it'll return the value if it's defined
    var _returnIfDefined = (data) => {
        if(Array.isArray(data)) {
            var definedValue = '';

            definedValue = _.find(data, (_item) => {
                return !_.isUndefined(_item);
            });

            console.log("Defined Values -> ",definedValue);

            return definedValue;
        }

        if(!_.isUndefined(data)) {
            return data;
        }
        return '';
    };

    return {
        subscribe: subscribeToPodcast
    };
}]);