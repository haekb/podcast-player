ngApp.filter('trustUrl', ['$sce', ($sce) => {
    try {
        return (url) => {
            return $sce.trustAsResourceUrl(url);
        }
    } catch(e) {
        if(DEBUG) console.error("trustURL failed: ",e);
    }
}]);