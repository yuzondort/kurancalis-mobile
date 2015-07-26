var requiredModules = ['ionic', 'ngResource', 'ngRoute', 'facebook', 'restangular', 'LocalStorageModule', 'ngTagsInput', 'duScroll', 'directives.showVerse', 'directives.repeatCompleted', 'ui.select', 'myConfig', 'authorizationModule'];

if (config_data.isMobile) {
    var mobileModules = [];//'ionic'
    mobileModules.forEach(function (item) {
        requiredModules.push(item);
    });
}
var app = angular.module('ionicApp', requiredModules)
    .filter('to_trusted', ['$sce',
        function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }])
    .filter('newLineAllowed', [
        function () {
            return function (text) {
                if (typeof text != 'undefined') {
                    return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
                } else {
                    return '';
                }
            };
        }])
    .filter('with_footnote_link', [
        function () {
            return function (text, translation_id, author_id) {
                return text.replace(/\*+/g, "<a class='footnote_asterisk' href='javascript:angular.element(document.getElementById(\"theView\")).scope().list_footnotes(" + translation_id + "," + author_id + ")'>*</a>");
            };
        }])
    .filter('selectionFilter', function () {
        return function (items, props) {
            var out = [];
            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        if (typeof props[prop] != 'undefined') {
                            var text = props[prop].toLowerCase();
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        } else {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        }
    })
    .filter('mark_verse_annotation', [
        function () {
            return function (translation, annotation, markVerseAnnotations) {
                if (markVerseAnnotations == true) {
                    var startOffset = annotation.ranges[0].startOffset;
                    var endOffset = annotation.ranges[0].endOffset;

                    var newText =
                            translation.substring(0, startOffset) +
                            "<span class='annotator-hl a_hl_" + annotation.colour + "'>" +
                            translation.substring(startOffset, endOffset) +
                            "</span>" +
                            translation.substring(endOffset, translation.length)
                        ;
                    return newText;
                } else {
                    return translation;
                }
            };
        }])
    .run(['$route', '$rootScope', '$location', '$ionicPlatform', function ($route, $rootScope, $location, $ionicPlatform) {


        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });


        var original = $location.path;
        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };
    }]).directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });


if (config_data.isMobile == false) { //false
    //desktop version
    app.config(function ($routeProvider, FacebookProvider, RestangularProvider, localStorageServiceProvider) {
        RestangularProvider.setBaseUrl(config_data.webServiceUrl);
        localStorageServiceProvider.setStorageCookie(0, '/');


        //route
        $routeProvider
            .when('/chapter/:chapterId/author/:authorMask/verse/:verseNumber/', {
                controller: 'HomeCtrl',
                templateUrl: 'app/components/home/homeView.html',
                reloadOnSearch: false
            })
            .when('/annotations/', {
                controller: 'AnnotationsCtrl',
                templateUrl: 'app/components/annotations/annotationsView.html',
                reloadOnSearch: false
            })
            .when('/people/find_people/', {
                controller: 'PeopleFindCtrl',
                templateUrl: 'app/components/people/find_people.html',
                reloadOnSearch: false
            })
            .when('/people/people_have_you/', {
                controller: 'PeopleHaveYouCtrl',
                templateUrl: 'app/components/people/people_have_you.html',
                reloadOnSearch: false
            })
            .when('/people/circles/', {
                controller: 'PeopleCirclesCtrl',
                templateUrl: 'app/components/people/circles.html',
                reloadOnSearch: false
            })
            .when('/people/explore/', {
                controller: 'PeopleExploreCtrl',
                templateUrl: 'app/components/people/explore.html',
                reloadOnSearch: false
            })
            .when('/', {
                controller: 'HomeCtrl',
                templateUrl: 'app/components/home/homeView.html',
                reloadOnSearch: false
            })
            .when('/chapter/:chapterId/author/:authorMask/', {
                redirectTo: '/chapter/:chapterId/author/:authorMask/verse/1/'
            })
            .otherwise({
                redirectTo: '/'
            });

        //facebook
        FacebookProvider.init(config_data.FBAppID);

    });

} else {
    app.config(function ($routeProvider, FacebookProvider, RestangularProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider) {
            console.log("mobile version")

            //redirect / to /m/www/
            var currentPath = window.location.pathname;
            if (currentPath == '/kurancalis-web/' || currentPath == '/') {
                window.location.href = currentPath + 'm/www/';
            }

            RestangularProvider.setBaseUrl(config_data.webServiceUrl);
            localStorageServiceProvider.setStorageCookie(0, '/');
            //route
            $routeProvider
                .when('/chapter/:chapterId/author/:authorMask/verse/:verseNumber/', {
                    controller: 'HomeCtrl',
                    templateUrl: 'components/home/home.html',
                    reloadOnSearch: false
                })
                .when('/annotations/', {
                    controller: 'AnnotationsCtrl',
                    templateUrl: 'components/annotations/all_annotations.html',
                    reloadOnSearch: false
                })
                .when('/people/find_people/', {
                    controller: 'PeopleFindCtrl',
                    templateUrl: 'app/components/people/find_people.html',
                    reloadOnSearch: false
                })
                .when('/people/people_have_you/', {
                    controller: 'PeopleHaveYouCtrl',
                    templateUrl: 'app/components/people/people_have_you.html',
                    reloadOnSearch: false
                })
                .when('/people/circles/', {
                    controller: 'PeopleCirclesCtrl',
                    templateUrl: 'app/components/people/circles.html',
                    reloadOnSearch: false
                })
                .when('/people/explore/', {
                    controller: 'PeopleExploreCtrl',
                    templateUrl: 'app/components/people/explore.html',
                    reloadOnSearch: false
                })
                .when('/', {
                    controller: 'HomeCtrl',
                    templateUrl: 'components/home/home.html',
                    reloadOnSearch: false
                })
                .when('/chapter/:chapterId/author/:authorMask/', {
                    redirectTo: '/chapter/:chapterId/author/:authorMask/verse/1/'
                })
                .otherwise({
                    redirectTo: '/'
                });


            openFB.init({appId: config_data.FBAppID});

            /*
             $ionicAppProvider.identify({
             // The App ID (from apps.ionic.io) for the server
             app_id: '30f3e1ed',
             // The public API key all services will use for this app
             api_key: 'fc14493a35cb42bd3f7dab2b09071ea96a03ad62b5d55770',
             // The GCM project ID (project number) from your Google Developer Console (un-comment if used)
             // gcm_id: 'YOUR_GCM_ID'
             });
             */
        }
    );

}

app.factory('ChapterVerses', function ($resource) {
    return $resource(config_data.webServiceUrl + '/chapters/:chapter_id/authors/:author_mask', {
        chapter_id: '@chapter_id',
        author_mask: '@author_mask'
    }, {
        query: {
            method: 'GET',
            params: {
                chapter_id: '@chapter_id',
                author_mask: '@author_mask'
            },
            isArray: true
        }
    });
}).factory('Footnotes', function ($resource) {
    return $resource(config_data.webServiceUrl + '/translations/:id/footnotes', {
        chapter_id: '@translation_id'
    }, {
        query: {
            method: 'GET',
            params: {
                id: '@translation_id'
            },
            isArray: true
        }
    });
}).factory('ListAuthors', function ($resource) {
    return $resource(config_data.webServiceUrl + '/authors', {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}).factory('User', function ($resource) {

    return $resource(config_data.webServiceUrl + '/users',
        {},

        {
            query: {
                method: 'GET',
                headers: {
                    "access_token": this.accessToken
                },
                isArray: false
            },
            save: {
                method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                isArray: false
            }
        }
    );
})

    .controller('MainCtrl', function ($scope, $q, $routeParams, $ionicSideMenuDelegate, $location, $timeout, ListAuthors, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, authorization) {
        console.log("MainCtrl");


        //all root scope parameters should be defined and documented here
        $scope.access_token = "";
        $scope.loggedIn = false;
        $scope.verseTagsJSON = {};
        $scope.chapter_id = 1;
        $scope.chapters = [];
        $scope.chapterSelected = 1;
        var chaptersVersion = 3;

        $scope.circleDropdownArray = [];

        //selected authors
        $scope.selection = ["16", "32"];
        $scope.verseTagContentAuthor = $scope.selection[0];
        $scope.activeVerseTagContentAuthor = "";
        $scope.authorMap = new Object();

        /* facebook login */

        $scope.fbLoginStatus = 'disconnected';
        $scope.facebookIsReady = false;

        //editor model
        $scope.annotationModalData = {};
        $scope.annotationModalDataTagsInput = [];
        $scope.annotationModalDataVerse = "0:0";
        $scope.cevres = [];
        $scope.kisis = [];
        $scope.yrmcevres = [];
        $scope.yrmkisis = [];

        //    $scope.user = null;

        $scope.modal_editor = null;
        $scope.author_mask = 1040;
        $scope.authorMaskCheckPoint = $scope.author_mask;

        $scope.verse = {};
        $scope.annotations = [];

        $scope.tagSearchResult = [];

        $scope.filterTags = [];

        $scope.verseTags = [];

        $scope.verseTagsJSON = [];
        $scope.editorSubmitted = 0;
        $scope.verseTagContents = [];


        //go to chapter / verse parameters for header display
        $scope.goToVerseParameters = {};
        $scope.goToVerseParameters.chapter = 1;
        $scope.goToVerseParameters.verse = 0;

        //route variables
        $scope.myRoute = [];
        $scope.myRoute['tag'] = '';
        $scope.myRoute['tagAuthor'] = '';
        $scope.myRoute['targetVerse'] = '';
        $scope.targetVerseForTagContent = 0;

        //verse tags
        $scope.verseTagContentParams = [];
        $scope.targetVerseForTagContent = 0;


        $scope.selection = [];

        //hizli meal gosterimi - show verse
        $scope.showVerseData = {};
        $scope.markVerseAnnotations = true;
        $scope.showVerseAtTranslation = 0;

        //tutorial
        $scope.showTutorial = 0;
        $scope.tutorialCarouselActive = 0;

        /* side panel */
        $scope.sidebarActive = 0;
        $scope.tagSearchResult = [];
        $scope.searchText = "";

        //mobile
        $scope.annotationAddable = false;

        //hide list of authors div
        $scope.showAuthorsList = false;

        //Çevreleri listeleme - show circles
        $scope.extendedCircles = [];
        $scope.extendedCirclesForSearch = [];

        $scope.tutorial = function (parameter) {
            if (parameter == 'init') {
                if ($scope.loggedIn == false) {
                    $('#tutorialModal').modal('show');
                }
            } else if (parameter == 'next') {
                $('#tutorialCarousel').carousel('next');
                $scope.tutorialCarouselActive++;
            } else if (parameter == 'previous') {
                $('#tutorialCarousel').carousel('prev');
                $scope.tutorialCarouselActive--;
            }

        }


        //currentPage
        $scope.getCurrentPage = function () {
            var retcp = "";
            if ($location.path() == '/annotations/') {
                retcp = 'annotations';
            } else {
                retcp = 'home';
            }
            return retcp;
        }


        /* auth */
        //general login.
        $scope.onFacebookLoginSuccess = function (responseData) {
            if (responseData.loggedIn == false) {
                $scope.loggedIn = false;
                $scope.logOut();
            }
            else {
                $scope.access_token = responseData.token;
                $scope.user = responseData.user;
                $scope.loggedIn = true;

                $scope.initializeCircleLists();

                $scope.$broadcast('login', responseData);
            }
        }


        //general logout.
        $scope.onFacebookLogOutSuccess = function (responseData) {
            if (responseData.loggedOut == true) {

                $scope.verseTagsJSON = {};
                $scope.access_token = "";
                $scope.loggedIn = false;
                $scope.user = null;

                $scope.$broadcast('logout', responseData);

                window.location.href = '#/';
            }
        }


        //sub page should write the its function if it needs custom login.
        $scope.login = function () { //new
            authorization.login($scope.onFacebookLoginSuccess);
        }

        $scope.logOut = function () { //new
            $ionicSideMenuDelegate.toggleLeft();
            authorization.logOut($scope.onFacebookLogOutSuccess);

        }

        /*
         $scope.api = function () {
         Facebook.api('/me', {fields: 'email'}, function (response) {
         //   $scope.user = response.email;
         });
         };
         */
        $scope.$watch(function () {
                return Facebook.isReady();
            }, function (newVal) {
                if (newVal) {
                    $scope.facebookIsReady = true;
                }
            }
        );
        $scope.checkUserLoginStatus = function () {
            var status = false;
            var access_token = authorization.getAccessToken();
            if (access_token != null && access_token != "") {
                $scope.access_token = access_token;
                $scope.get_user_info();
                $scope.loggedIn = true;

                status = true;

                //Show Circles - Kullanıcı login olduğunda çevre listesi çekilir.
                $scope.initializeCircleLists();

            }
            else {
                $scope.loggedIn = false;
                //do some cleaning
            }

            return status;
        };

        $scope.goToVerseParameters.setSelectedChapter = function (chapter) {
            $scope.goToVerseParameters.chapter = chapter;
        };


        //get user info

        $scope.get_user_info = function () {
            var usersRestangular = Restangular.all("users");
            //TODO: document knowhow: custom get with custom header
            usersRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (user) {
                    $scope.user = user;
                }
            );
        }


        //     $scope.checkUserLoginStatus();
        /* end of facebook login */
        /* end of auth */


        $scope.initRoute = function () {

            if (typeof $routeParams.tag !== 'undefined') {
                $scope.myRoute['tag'] = $routeParams.tag;
            }
            if (typeof $routeParams.tagAuthor !== 'undefined') {
                $scope.myRoute['tagAuthor'] = $routeParams.tagAuthor;
            }
            if (typeof $routeParams.targetVerse !== 'undefined') {
                $scope.targetVerseForTagContent = $routeParams.targetVerse;
            }

        };


        $scope.getTagsWithCommaSeparated = function (tagList) {
            //prepare tags
            var tagParameter = [];

            for (var i = 0; i < tagList.length; i++) {
                tagParameter[i] = tagList[i].id;
            }

            return tagParameter.join(',');
        };


        $scope.getTagParametersForAnnotatorStore = function (canViewCircles, canCommentCircles, canViewUsers, canCommentUsers, tags) {
            //prepare tags
            var tagParameters = {};
            tagParameters.canViewCircles = [];
            tagParameters.canViewUsers = [];
            tagParameters.canCommentCircles = [];
            tagParameters.canCommentUsers = [];

            for (var i = 0; i < canViewCircles.length; i++) {
                tagParameters.canViewCircles[i] = canViewCircles[i].id;
            }

            for (var i = 0; i < canViewUsers.length; i++) {
                tagParameters.canViewUsers[i] = canViewUsers[i].id;
            }

            for (var i = 0; i < canCommentUsers.length; i++) {
                tagParameters.canCommentUsers[i] = canCommentUsers[i].id;
            }

            for (var i = 0; i < canCommentCircles.length; i++) {
                tagParameters.canCommentCircles[i] = canCommentCircles[i].id;
            }

            //the tags data should be in annotationModalDataTagInputs
            var jsTags = tags;

            if (typeof jsTags == 'undefined') {
                jsTags = [];
            }

            var newTags = [];
            for (var i = 0; i < jsTags.length; i++) {
                newTags.push(jsTags[i].name);
            }

            tagParameters.tags = newTags;

            return tagParameters;
        };

        //retrives the permissions of an annotation to scope variables
        $scope.coVliste = function (annoid) {
            var cevregosterRestangular = Restangular.one("annotations", annoid).all("permissions");
            cevregosterRestangular.customGET("", "", {'access_token': $scope.access_token}).then(function (cevreliste) {


                //todo: replace locale "All circles" and "All users" for -2 and -1 circle ids
                var clis = [];
                for (var i = 0; i < cevreliste.canViewCircles.length; i++) {
                    clis.push({'id': cevreliste.canViewCircles[i].id, 'name': cevreliste.canViewCircles[i].name});
                }
                $scope.cevres = clis;

                var clis1 = [];
                for (var i = 0; i < cevreliste.canViewUsers.length; i++) {
                    clis1.push({'id': cevreliste.canViewUsers[i].id, 'name': cevreliste.canViewUsers[i].name});
                }

                $scope.kisis = clis1;

                var clis2 = [];
                for (var i = 0; i < cevreliste.canCommentCircles.length; i++) {
                    clis2.push({
                        'id': cevreliste.canCommentCircles[i].id,
                        'name': cevreliste.canCommentCircles[i].name
                    });
                }

                $scope.yrmcevres = clis2;

                var clis3 = [];
                for (var i = 0; i < cevreliste.canCommentUsers.length; i++) {
                    clis3.push({'id': cevreliste.canCommentUsers[i].id, 'name': cevreliste.canCommentUsers[i].name});
                }

                $scope.yrmkisis = clis3;

            });
        };

        $scope.showEditor = function (annotation, position) {


            if (typeof annotation.annotationId != 'undefined') {
                $scope.cevres = [];
                $scope.kisis = [];
                $scope.yrmcevres = [];
                $scope.yrmkisis = [];
                $scope.coVliste(annotation.annotationId);
            }
            if ($scope.cevres.length == 0 && $scope.kisis.length == 0 && $scope.yrmcevres.length == 0 && $scope.yrmkisis.length == 0) {
                //all empty //share to everyone by default

                $scope.cevres.push({'id': '-1', 'name': 'Herkes'});
            }
            else { //use previous values.

            }

            var newTags = [];

            //Volkan Ekledi.
            var cvrtags = [];
            if (typeof annotation.vcircles != 'undefined') {
                for (var i = 0; i < annotation.vcircles.length; i++) {
                    cvrtags.push({"id": annotation.vcircles[i]});
                }
            }
            //

            if (typeof annotation.tags != 'undefined') {
                for (var i = 0; i < annotation.tags.length; i++) {
                    newTags.push({"name": annotation.tags[i]});
                }
            }

            $scope.annotationModalData = annotation;
            $scope.annotationModalDataTagsInput = newTags;
            if (typeof $scope.annotationModalData.text == 'undefined') {
                $scope.annotationModalData.text = "";
            }
            $scope.annotationModalDataVerse = Math.floor(annotation.verseId / 1000) + ":" + annotation.verseId % 1000;
            //set default color
            if (typeof $scope.annotationModalData.colour == 'undefined')$scope.annotationModalData.colour = 'yellow';
            $scope.scopeApply();
            if (!config_data.isMobile) {
                $('#annotationModal').modal('show');

            } else {
                $scope.openModal('editor');
            }

        };


        //go to chapter for general purpuse.
        $scope.goToChapter = function () {
            window.location.href = '#/chapter/' + $scope.chapter_id + '/author/' + $scope.author_mask + '/verse/' + $scope.verse.number;
        };

        $scope.goToChapterWithParameters = function (chapter_id, author_mask, verse_number) {
            $scope.chapter_id = chapter_id;
            $scope.author_mask = author_mask;
            $scope.verse.number = verse_number;
            $scope.goToChapter();

        };

        /*
         moved to homectrl
         $scope.editAnnotation = function (index) {
         console.log("$scope.filteredAnnotations:"+$scope.filteredAnnotations);
         if (typeof $scope.filteredAnnotations != 'undefined' && $scope.filteredAnnotations.length > 0) {
         index = $scope.getAnnotationIndexFromFilteredAnnotationIndex(index);
         }
         annotator.onEditAnnotation($scope.annotations[index]);
         annotator.updateAnnotation($scope.annotations[index]);
         }
         */


        $scope.getIndexOfArrayByElement = function (arr, k, v) {
            var arrLen = arr.length;
            var foundOnIndex = -1;
            for (var i = 0; i < arrLen; i++) {
                if (arr[i][k] == v) {
                    foundOnIndex = i;
                }
            }
            return foundOnIndex;
        };


        $scope.scopeApply = function () {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };


        //Hizli Meal Gosterimi / Fast Translation Display
        $scope.showVerse = function (annotation) {
            $scope.showVerseData = {};
            Restangular.one('translations', annotation.translationId).get().then(function (translation) {
                $scope.markVerseAnnotations = true;
                $scope.showVerseData.annotationId = annotation.annotationId;
                $scope.showVerseData.data = translation;

            });
        };


        $scope.showVerseFromFootnote = function (chapterVerse, author, translationId) {

            $scope.showVerseData = {};
            $scope.showVerseData.data = {};
            var chapterAndVerse = seperateChapterAndVerse(chapterVerse);
            $scope.showVerseData.data.chapter = chapterAndVerse.chapter;
            $scope.showVerseData.data.verse = chapterAndVerse.verse;
            $scope.showVerseData.data.authorId = author;
            $scope.showVerseAtTranslation = translationId;
            $scope.showVerseByParameters('go');
            $(".showVerseData").show();

        };

        $scope.showVerseByParameters = function (action) {

            var showVerseParameters = [];
            if (action == 'next') {
                if ($scope.showVerseData.data.verse != ($scope.chapters[$scope.showVerseData.data.chapter - 1].verseCount)) {
                    $scope.showVerseData.data.verse++;
                } else {
                    $scope.showVerseData.data.chapter++;
                    $scope.showVerseData.data.verse = 0;
                }
            } else if (action == 'previous') {
                if ($scope.showVerseData.data.verse != 0) {
                    $scope.showVerseData.data.verse--;
                } else {
                    $scope.showVerseData.data.chapter--;
                    $scope.showVerseData.data.verse = $scope.chapters[$scope.showVerseData.data.chapter - 1].verseCount;
                }
            } else if (action == 'go') {

            }
            showVerseParameters.chapter = $scope.showVerseData.data.chapter;
            showVerseParameters.verse = $scope.showVerseData.data.verse;

            var verseId = $scope.showVerseData.data.chapter * 1000 + parseInt($scope.showVerseData.data.verse);
            var showVerseRestangular = Restangular.one('authors', $scope.showVerseData.data.authorId)
                                                .one('verse', verseId);
            showVerseRestangular.get().then(function (translation) {
                if (translation != "") {
                    $scope.markVerseAnnotations = false;
                    $scope.showVerseData.data = translation;
                }
            });
        };
        /* end of show verse */


        //list authors
        $scope.list_authors = function () {
            $scope.authorMap = new Object();
            $scope.authors = ListAuthors.query(function (data) {
                var arrayLength = data.length;
                for (var i = 0; i < arrayLength; i++) {
                    $scope.authorMap[data[i].id] = data[i];
                    $scope.setAuthors($scope.author_mask);
                }
                $scope.$broadcast("authorMap ready");
            });
        };


        //tags input auto complete function
        $scope.loadTags = function (query) {
            var tagsRestangular = Restangular.one('tags', query);
            return tagsRestangular.customGET("", {}, {'access_token': $scope.access_token});
        };

        //tags input auto complete
        $scope.cevrelistele = function () {

            return $scope.extendedCircles;
        };

        //tags input auto complete
        $scope.cevrelisteleForSearch = function () {

            return $scope.extendedCirclesForSearch;
        };

        $scope.initializeCircleLists = function () {

            $scope.extendedCircles = [];
            $scope.extendedCircles.push({'id': '-2', 'name': 'Tüm Çevrelerim'});
            $scope.extendedCircles.push({'id': '-1', 'name': 'Herkes'});

            $scope.extendedCirclesForSearch = [];
            $scope.extendedCirclesForSearch.push({'id': '-2', 'name': 'Tüm Çevrelerim'});


            $scope.circleDropdownArray = [];
            $scope.circleDropdownArray.push({'id': '-2', 'name': 'Tüm Çevrelerim'});
            $scope.circleDropdownArray.push({'id': '', 'name': 'Sadece Ben'});

            $scope.query_circle_dropdown = $scope.circleDropdownArray[1];

            Restangular.all("circles").customGET("", {}, {'access_token': $scope.access_token}).then(function (circleList) {
                $scope.circleDropdownArray.push.apply($scope.circleDropdownArray, circleList);

                //also initialize extended circles
                $scope.extendedCircles.push.apply($scope.extendedCircles, circleList);
                $scope.extendedCirclesForSearch.push.apply($scope.extendedCirclesForSearch, circleList);


            });

        }

        //tags input auto complete
        $scope.kisilistele = function (kisiad) {
            var kisilisteRestangular = Restangular.all("users/search");
            $scope.usersParams = [];
            $scope.usersParams.search_query = kisiad;
            return kisilisteRestangular.customGET("", $scope.usersParams, {'access_token': $scope.access_token});

        };

        //selected authors
        $scope.setAuthors = function (authorMask) {
            $scope.selection = [];
            for (var index in $scope.authorMap) {
                if (authorMask & $scope.authorMap[index].id) {
                    $scope.selection.push($scope.authorMap[index].id);
                }
            }
        };

        //toggle selection for an author id
        $scope.toggleSelection = function toggleSelection(author_id) {
            var idx = $scope.selection.indexOf(author_id);

            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selection.push(author_id);
            }
            $scope.author_mask = 0;
            for (var index in $scope.selection) {
                $scope.author_mask = $scope.author_mask | $scope.selection[index];
            }
            //$scope.setAuthorMask();
            //localStorageService.set('author_mask', $scope.author_mask);
        };

        //go to chapter / verse from navigation header
        $scope.goToVerse = function () {
            $scope.query_chapter_id = $scope.goToVerseParameters.chapter.id ;
            $scope.verse.number = $scope.goToVerseParameters.verse;
            $scope.goToChapter();
        };

        $scope.verseNumberValidation = function (chapters, chapter_id, verse_number) {
            var chapters = $scope.chapters;
            var chapter_id = $scope.goToVerseParameters.chapter.id;
            var verse_number = $scope.goToVerseParameters.verse;

            //search array with id
            var validationErrorMessage = "Geçerli ayet ve sure numarası giriniz";
            var index = chapters.map(function (el) {
                return el.id;
            }).indexOf(chapter_id);
            if (index == -1 || chapters[index].verseCount < verse_number || isNaN(chapter_id) || isNaN(verse_number)) {
                if (typeof annotator != 'undefined') {
                    Annotator.showNotification(validationErrorMessage);
                } else {
                    alert(validationErrorMessage);
                }
            } else {
                $scope.goToVerse();
            }
        };

        $scope.initializeController = function () {


            if (config_data.isMobile) {
                /*
                 $scope.currentState = $state.current.name;
                 $rootScope.$on('$stateChangeSuccess',
                 function (event, toState, toParams, fromState, fromParams) {
                 $scope.currentState = toState.name;
                 $scope.scopeApply();
                 })
                 */


                $scope.openModal = function (id) {
                    if (id == 'editor') {
                        $scope.modal_editor.show();
                    }
                };

                $scope.closeModal = function (id) {
                    if (id == 'editor') {
                        clearTextSelection();
                        $scope.modal_editor.hide();
                    }
                }

                $scope.annotationAddable = false;
                $scope.selectionEnded = function () {
                    $scope.annotationAddable = true;
                    $scope.scopeApply();
                }

                $scope.selectionCancel = function () {
                    $scope.annotationAddable = false;
                    $scope.scopeApply();
                }
            }
            if ($location.path() == "/") {
                $scope.showTutorial = 1;
            }

            //list the authors on page load
            $scope.list_authors(); //prepare map


            // $scope.toggleSidebar();
            sidebarInit();


            //list of chapters
            $scope.chapters = [];

            var localChaptersVersion = localStorageService.get('chaptersVersion');

            if (localChaptersVersion == null || localChaptersVersion < chaptersVersion) {
                Restangular.all('chapters').getList().then(function (data) {
                    $scope.chapters = data;
                    localStorageService.set('chapters', data);
                    localStorageService.set('chaptersVersion', chaptersVersion);
                });
            } else {
                $scope.chapters = localStorageService.get('chapters');
            }


            if ($scope.myRoute['tag'] != "") {
                $scope.goToVerseTag($scope.targetVerseForTagContent, $scope.myRoute['tag']);
            }

            //init chapter select box
            var chaptersLen = $scope.chapters.length;
            for (var chaptersIndex = 0; chaptersIndex < chaptersLen; chaptersIndex++) {
                if ($scope.chapters[chaptersIndex].id == $scope.chapter_id) {
                    $scope.goToVerseParameters.chapter = $scope.chapters[chaptersIndex];
                    break;
                }
            }

        };//end of init controller


        //initialization

        //initialization
        $scope.initRoute();

        $scope.initializeController();


    });


function sidebarInit() {
    $('.cd-panel').on('click', function (event) {
        if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    });
}

function openPanel() {
    $('#cd-panel-right').addClass('is-visible');
}
function closePanel() {
    $('#cd-panel-right').removeClass('is-visible');
}
function togglePanel() {
    if ($('#cd-panel-right').hasClass('is-visible')) {
        closePanel();
    } else {
        openPanel();
    }
}
function openLeftPanel() {
    $('#cd-panel-left').addClass('is-visible');
}
function closeLeftPanel() {
    $('#cd-panel-left').removeClass('is-visible');
}

function toggleLeftPanel() {
    if ($('#cd-panel-left').hasClass('is-visible')) {
        closeLeftPanel();
    } else {
        openLeftPanel();
    }
}

function verseTagClicked(elem) {
    var closeClick = false;
    if ($(elem).hasClass('btn-warning')) {
        angular.element(document.getElementById('theView')).scope().targetVerseForTagContent = -1;
        //   angular.element(document.getElementById('MainCtrl')).scope().targetVerseForTagContent = -1;
        closeClick = true;
    }

    //disable previous active element
    $('.verse_tag.btn-warning').removeClass('btn-warning').removeClass('btn-sm').addClass("btn-info").addClass("btn-xs").removeClass('activeTag');


    //activate element
    if (!closeClick) {
        $(elem).addClass("btn-warning").addClass("activeTag").addClass("btn-sm").removeClass('btn-info').removeClass('btn-xs');
    }
}

function seperateChapterAndVerse(data) {
    var ret = [];
    var seperator = data.indexOf(':');
    ret.chapter = data.substring(0, seperator);
    ret.verse = data.substring(seperator + 1, data.length);
    return ret;
}

function clearTextSelection() {
    if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {  // IE?
        document.selection.empty();
    }
}

function focusToVerseInput() {
    setTimeout(function () {
        document.getElementById('chapterSelection_verse').focus();
        document.getElementById('chapterSelection_verse').select();
    }, 300);
}