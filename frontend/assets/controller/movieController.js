app.controller('movieCtrl', function($scope, sharedScope, $http) {
    $scope.data = {
        recommand_list: [],
        rated_list: [],
        rate: ''
    };
    $scope.loginData = sharedScope.loginData;

    var getRecommendList = function() {
        var option = {
            url: '/api/movie/recommand_list',
            params: { from: 0, count: 4 },
            headers: {},
            method: 'get'
        }
        var jwt_token = Cookies.get('jwt_token');
        if (jwt_token != undefined) option.headers.Authorization = 'Bearer ' + jwt_token;
        $http(option)
            .then(function success(res) {
                    $scope.data.recommand_list = res.data.movies;
                },
                function error(res) {

                });
    }

    var getRateList = function() {
        var jwt_token = Cookies.get('jwt_token');
        if (jwt_token != undefined) {
            var option = {
                url: '/api/movie/rate_list',
                params: { from: 0, count: 100 },
                headers: { "Authorization": 'Bearer ' + jwt_token },
                method: 'get'
            }

            $http(option)
                .then(function success(res) {
                        $scope.data.rated_list = res.data.movies;
                    },
                    function error(res) {

                    });
        }
    }

    $scope.rate = function(value) {
        var movie_id = value.split('_')[0];
        var score = value.split('_')[1];

        var jwt_token = Cookies.get('jwt_token');

        var option = {
            url: '/api/movie/rate',
            data: { movie_id: movie_id, rate: score },
            headers: { "Authorization": 'Bearer ' + jwt_token },
            method: 'post'
        }
        $http(option)
            .then(function success(res) {
                    $scope.data.recommand_list = $scope.data.recommand_list.filter(function(movie) {
                        return movie.id != movie_id;
                    });
                },
                function error(res) {

                });
    }

    $scope.update = function(value) {
        var movie_id = value.split('_')[0];
        var score = value.split('_')[1];

        var jwt_token = Cookies.get('jwt_token');

        var option = {
            url: '/api/movie/update_score',
            data: { movie_id: movie_id, rate: score },
            headers: { "Authorization": 'Bearer ' + jwt_token },
            method: 'put'
        }
        $http(option)
            .then(function success(res) {
                    getRateList();
                },
                function error(res) {

                });
    }

    $scope.$watch('data.recommand_list', function(newValue, oldValue) {
        if (newValue.length == 0) {
            getRecommendList();
        }
        getRateList();
    });

    $scope.$watch('loginData.loginStatus', function(newValue, oldValue) {
        getRateList();
    });
});