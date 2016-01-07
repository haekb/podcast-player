//var parser = RSSParser;
ngApp.factory('parseRssService', ['x2js', function(x2js) {
    //var parser = Parser;//require('rss-parser');

    var parseXml = (data) => {
        return x2js.xml_str2json(data);
    };

    return {
        parse: parseXml
    };
}]);