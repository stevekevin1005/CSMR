app.controller('loginCtrl', function($scope, sharedScope, $http) {

    $scope.data = {};
    $scope.loginData = sharedScope.loginData;

    $scope.$watch('data.email', function(newValue, oldValue) {
        if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.data.email)) {
            $scope.data.email_error = "";
            $scope.data.sign_up_email_error = "";
            $scope.data.check_email_legal = true;
        } else {
            $scope.data.check_email_legal = false;
            if ($scope.data.email != undefined) {
                $scope.data.email_error = "email is illegal.";
                $scope.data.sign_up_email_error = "email is illegal.";
            }
        }
    });

    $scope.login = function() {
        if ($scope.data.check_email_legal == true) {
            var url = '/api/user/login';
            var email = $scope.data.email;
            var password = $scope.data.password;

            var data = {
                'email': email,
                'password': password
            };

            $http.post(url, data)
                .then(function success(res) {
                    $("#close_login_form").trigger('click');
                    Cookies.set('jwt_token', res.data.token);
                    $scope.loginData.loginStatus = true;
                    $scope.loginData.loginEmail = email;
                    $scope.data.login_error = "";
                }, function error(res) {
                    $scope.data.login_error = res.data.description;
                });
        }
    }

    $scope.logout = function() {
        $scope.loginData.loginStatus = false;
        $scope.loginData.loginEmail = "";
        Cookies.remove('jwt_token');
    }

    $scope.checkEmailExist = function() {
        if ($scope.data.check_email_legal == true) {
            var url = '/api/user/check';
            $http.get(url, { params: { email: $scope.data.email } })
                .then(function success(res) {
                    $scope.data.sign_up_email_check = true;
                    $scope.data.sign_up_email_error = "";
                }, function error(res) {
                    $scope.data.sign_up_email_check = false;
                    $scope.data.sign_up_email_error = res.data.description;
                });

        }
    }

    $scope.$watch('data.sign_up_password', function(newValue, oldValue) {
        if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test($scope.data.sign_up_password)) {
            $scope.data.check_password_legal = true;
            $scope.data.sign_up_password_error = "";
        } else {
            if ($scope.data.sign_up_password != undefined) {
                $scope.data.check_password_legal = false;
                $scope.data.sign_up_password_error = "Minimum six characters, at least one letter and one number.";
            }
        }
    });

    $scope.signUp = function() {
        if ($scope.data.sign_up_email_check == true && $scope.data.check_password_legal == true) {
            var url = '/api/user/register';
            var email = $scope.data.email;
            var password = $scope.data.sign_up_password;

            var data = {
                'email': email,
                'password': password
            };

            $http.post(url, data)
                .then(function success(res) {
                    $("#close_sign_up_form").trigger('click');
                    Cookies.set('jwt_token', res.data.token);
                    $scope.data.sign_up_email_check = false;
                    $scope.loginData.loginStatus = true;
                    $scope.loginData.loginEmail = email;
                    $scope.data.sign_up_error = "";
                }, function error(res) {
                    $scope.data.sign_up_error = res.data.description;
                });

        }
    }
});