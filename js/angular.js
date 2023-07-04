// getNAme File omg
var nameFile = [];
function getNameFile(event) {
    console.log(event);
    var files = event.target.files;

    for (let index = 0; index < files.length; index++) {
        nameFile.push(files[index].name);

    }
    console.log(nameFile);

    // if (files.length > 0) {
    //     nameFile = files[0].name;
    // }
}


var userLogin = {};

var app = angular.module('myApp', ['ngRoute', 'LocalStorageModule']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',

        })
        .when('/home', {
            templateUrl: 'home.html',

        })
        .when('/products', {
            templateUrl: 'products.html',
        })
        .when('/products/:productId', {
            templateUrl: 'detail.html',
            controller: 'detailController'
        })
        .when('/login', {
            templateUrl: 'login.html',
        })
        .when('/profile', {
            templateUrl: 'profile.html',
        })
        .when('/admin', {
            templateUrl: 'admin/index.html',
        })
        .when('/admin/account', {
            templateUrl: 'admin/account.html',
        })
        .when('/admin/product', {
            templateUrl: 'admin/product.html',
        })
        .when('/admin/category', {
            templateUrl: 'admin/category.html',
        })
        .when('/admin/oder_details', {
            templateUrl: 'admin/oder_details.html',
        })

        .when('/cart', {
            templateUrl: 'cart.html',
        })
        .when('/pay', {
            templateUrl: 'pay.html',
        })
        .otherwise({
            templateUrl: 'home.html',
        });
});

app.controller('myController', function ($scope, $rootScope) {



});

app.controller('userController', function ($scope, $rootScope, $http, $location, $window, localStorageService) {
    var userVariables = {
        id: "",
        name: "",
        email: "",
        password: "",
        birthday: "",
        avatar: "",
        address: "",
        gender: "",
    }
    $rootScope.user = {};
    $rootScope.checkUser = false;
    $rootScope.checkUserAdmin = false;
    var savedUserAccount = localStorageService.get('userAccount');
    $rootScope.user = savedUserAccount || userVariables;
    if ($rootScope.user.name != "") {
        $rootScope.checkUser = true;
        if ($rootScope.user.role == 0) {
            $rootScope.checkUserAdmin = true;
        }
    }
    console.log($rootScope.user);

    $scope.logout = function () {
        $location.path('/login');
        localStorageService.remove('userAccount');
        $rootScope.user = userVariables;
        $rootScope.checkUser = false;
        $rootScope.checkUserAdmin = false;


    }
    // $scope.countCart = 0;

    // Đếm Giỏ Hàng
    $rootScope.countCart = 0;
    var bill = [];
    $http.get('http://localhost:3000/bill/?idUser=' + $rootScope.user.id + '&status=0').then(function (response) {
        bill = response.data;
        var count = 0;
        $http.get('http://localhost:3000/billDetail/?idBill=' + bill[0].id)
            .then(function (response) {
                count = response.data;
                $rootScope.countCart = count.length;
            })
    })



})


// products
app.controller('productsController', function ($scope, $rootScope, $http) {
    $scope.listProducts = [];
    $http.get('http://localhost:3000/products').then(function (response) {
        $scope.listProducts = response.data;
    })
    $scope.listCategory = [];
    $http.get('http://localhost:3000/categories').then(function (response) {
        $scope.listCategory = response.data;
    })

    $scope.fillterProduct = {

    };
    $scope.clickFillterProductAll = function (id) {
        // alert("ssss")
        $scope.fillterProduct = {
        };
    }
    $scope.clickFillterProduct = function (id) {
        // alert("ssss")
        $scope.fillterProduct = {
            category: id
        };
    }
    var checkFillProNew = false;
    $scope.oderProductNew = ''
    $scope.clickFillterProductNew = function () {
        if (checkFillProNew == false) {
            $scope.oderProductNew = '-dateCreate';
            checkFillProNew = true;
        }else{
            $scope.oderProductNew = 'dateCreate';
            checkFillProNew = false;
        }
    }

    var checkFillProPay = false;
    $scope.oderProductPay = '';
    $scope.clickFillterProductPay = function () {
        if (checkFillProPay == false) {
            $scope.oderProductPay = '-sold';
            checkFillProPay = true;
        }else{
            $scope.oderProductPay = 'sold';
            checkFillProPay = false;
        }
    }

    $scope.checkFillProPrice ='';
    $scope.oderProductPrice = '';
    $scope.clickFillterProductPrice = function () {
        if ($scope.checkFillProPrice == 'false') {
            $scope.oderProductPrice = 'price';
        }else if ($scope.checkFillProPrice == 'true') {
            $scope.oderProductPrice = '-price';
        }else{
            $scope.oderProductPrice = '';
        }
        // alert('sss')
    }
});






//login_register
app.controller('loginController', ['$scope', '$routeParams', '$rootScope', '$http', '$location', '$window', 'localStorageService', function ($scope, $routeParams, $rootScope, $http, $location, $window, localStorageService) {



    $scope.form_login = {
        email: '',
        password: ''
    }
    $scope.form_register = {
        name: "",
        email: "",
        password: "",
        birthday: "",
        avatar: "icon.png",
        role: 1,
        gender: 'true',
        address: "",
    }
    //login
    $scope.login = function (event) {
        event.preventDefault();
        console.log($scope.form_login.email);
        $http.get('http://localhost:3000/users/?email=' + $scope.form_login.email).then(function (response) {
            var getUser = response.data;
            console.log(getUser);
            if (getUser.length != 0) {
                if (getUser[0].password == $scope.form_login.password) {
                    alert("Đăng Nhập Thành Công")
                    $rootScope.user = getUser[0];
                    $rootScope.checkUser = true;
                    if ($rootScope.user.role == 0) {
                        $rootScope.checkUserAdmin = true;
                    }
                    $location.path('/home');

                } else {
                    alert("Sai Password\nPassword của bạn phải là: "+ getUser[0].password)
                }
                localStorageService.set('userAccount', $rootScope.user);

                //đếm rỏ hàng

                var bill = [];
                $http.get('http://localhost:3000/bill/?idUser=' + $rootScope.user.id + '&status=0').then(function (response) {
                    bill = response.data;
                    var count = 0;
                    $http.get('http://localhost:3000/billDetail/?idBill=' + bill[0].id)
                        .then(function (response) {
                            count = response.data;
                            $rootScope.countCart = count.length;
                        })
                })
            }else{
                alert("Không Tìm Thấy User")
            }

        })



    }
    //register
    $scope.register = function (event) {
        var userCheck = [];
        $http.get('http://localhost:3000/users/?email=' + $scope.form_register.email).then(function (response) {
            userCheck = response.data;
            if (userCheck != 0) {
                alert("Email Đã Tồn tại");
            } else {
                if ($scope.form_register.email ==""||
                $scope.form_register.name ==""||
                $scope.form_register.password ==""||
                $scope.form_register.birthday ==""||
                $scope.form_register.address ==""
                ) {
                  alert("Không Được Để Trống")  
                }else{
                    $http.post('http://localhost:3000/users/', $scope.form_register).then(function (response) {
                        alert("Đăng Ký Thành Công")
                        $location.path('/login');
    
                    })

                }
            }
        })

    }


    $scope.textTabLogin = "REGISTER";
    $scope.checkHideLogin_Regiter = false;
    $scope.clickTabLogin = function (event) {
        event.preventDefault();
        if ($scope.checkHideLogin_Regiter == false) {
            $scope.checkHideLogin_Regiter = true;
            $scope.textTabLogin = "LOGIN";
        } else {
            $scope.checkHideLogin_Regiter = false;
            $scope.textTabLogin = "REGISTER";
        }
    }
}]);

//profile
app.controller("profile", function ($scope, $rootScope, $http,localStorageService) {
    // view acc
    $scope.form_user = {
        name: $rootScope.user.name,
        email: $rootScope.user.email,
        password: $rootScope.user.password,
        birthday: new Date($rootScope.user.birthday),
        avatar: $rootScope.user.avatar,
        gender: $rootScope.user.gender,
        address: $rootScope.user.address,
        role: $rootScope.user.role,
    }

    //update info
    $scope.updateInfo = function (event) {
        event.preventDefault();
        $scope.form_user.avatar = nameFile[0];
        if ($scope.form_user.avatar == undefined) {
            $scope.form_user.avatar = $rootScope.user.avatar;
        }
        $http.put('http://localhost:3000/users/' + $rootScope.user.id, $scope.form_user)
            .then(function (response) {
                $rootScope.user = response.data;
                localStorageService.set('userAccount', $rootScope.user);
                alert("Cập Nhật ok")
            })
    }
    $scope.form_password = {
        password: "",
        password_confirm: "",
        password_confirm_confirm: "",
    }
    $scope.updatePassword = function (event) {
        if($scope.form_password.password == "" || $scope.form_password.password_confirm == "" || $scope.form_password.password_confirm_confirm == "") {
            alert("Không Được Để Trống")
        }
        else if ($scope.form_password.password_confirm != $scope.form_password.password_confirm_confirm) {
            alert("Mật Khẩu Xác Nhận Không Đúng")

        } else if ($scope.form_password.password != $rootScope.user.password) {
            console.log($rootScope.user.password);
            console.log($scope.form_password.password);
            alert("Mật Khẩu Cũ Không Đúng")
        } else
        {
            $scope.form_user.password = $scope.form_password.password_confirm;
            $http.put('http://localhost:3000/users/' + $rootScope.user.id, $scope.form_user)
                .then(function (response) {
                    $scope.form_user = response.data;
                    alert("Cập Nhật Mật Khẩu ok")
                })

        }


    }

});
//Detail 
app.controller('detailController', ['$scope', '$routeParams', '$rootScope', '$http', '$location', function ($scope, $routeParams, $rootScope, $http, $location) {
    //getDetail
    var productId = $routeParams.productId;
    $http.get('http://localhost:3000/products/' + productId).then(function (response) {
        $scope.product = response.data;
        console.log($scope.product.img);
    })
    var idUser = $rootScope.user.id;
    // var idUser = 1;
    console.log("iduser" + idUser);
    var bill = [];
    $http.get('http://localhost:3000/bill/?idUser=' + idUser + '&status=0').then(function (response) {
        bill = response.data;
    })
    $scope.inputBill = {
        size: 'M',
        quantity: 1
    }
    //Add product Giỏ Hàng

    function productToCar(idProduct, size, total) {
        //Tạo bill new
        if (bill.length == 0) {
            var billNew = {
                idUser: idUser,
                money: 0,
                dateCreate: new Date(),
                datePay: "01/01/1990",
                status: 0
            };
            $http.post('http://localhost:3000/bill/', billNew).then(function (response) {
                console.log(response.data);
            });
            //Get  bill
            $http.get('http://localhost:3000/bill/?idUser=' + idUser + '&status=0').then(function (response) {
                bill = response.data;
            })
        }

        console.log(idProduct + "IdProduct");
        var billDetailTemp = {};
        $http.get('http://localhost:3000/billDetail/?idBill=' + bill[0].id + '&idProduct=' + idProduct + '&size=' + size)
            .then(function (response) {
                //Cộng Rồn số Lượng
                billDetailTemp = response.data;
                if (billDetailTemp.length != 0) {
                    var billDetail = billDetailTemp[0];
                    billDetail.quantity = billDetail.quantity + total;
                    $http.put('http://localhost:3000/billDetail/' + billDetail.id, billDetail)
                        .then(function (response) {
                            console.log(response.data);
                        })
                } else {
                    //Tạo bill detail
                    var billDetail = {
                        idBill: bill[0].id,
                        idProduct: idProduct,
                        size: $scope.inputBill.size,
                        quantity: $scope.inputBill.quantity
                    }
                    console.log(billDetail);
                    $http.post('http://localhost:3000/billDetail/', billDetail).then(function (response) {

                    })
                }
            });




    }

    $scope.addProductToCart = function (idProduct, size, total) {
        if ($rootScope.user.id == '') {
            alert("Vui Lòng Đăng Nhập");
        } else {

            productToCar(idProduct, size, total);
            alert("Thêm  Giỏ Hàng Ok");

        }
    }
    $scope.payProductToCart = function (idProduct, size, total) {
        if ($rootScope.user.id == '') {
            alert("Vui Lòng Đăng Nhập");
        } else {
            productToCar(idProduct, size, total);
            $location.path("/cart");
        }
    }


}])

//cart

app.controller('cartController', function ($scope, $rootScope, $http, $location) {
    var idUser = $rootScope.user.id;
    // var idUser = 1;
    var bill = [];
    // $scope.billDetail = [];
    // $scope.inputCart = {
    //     quantity: 0
    // }
    $rootScope.lstCart = [];
    $rootScope.TotalMoney = 0;
    $http.get('http://localhost:3000/bill/?idUser=' + idUser + '&status=0')
        .then(function (response) {
            bill = response.data;
            //Tạo bill new
            if (bill.length == 0) {
                var billNew = {
                    idUser: idUser,
                    money: 0,
                    dateCreate: new Date(),
                    datePay: "01/01/1990",
                    status: 0
                };
                $http.post('http://localhost:3000/bill/', billNew).then(function (response) {
                    console.log(response.data);
                });
                $http.get('http://localhost:3000/bill/?idUser=' + idUser + '&status=0').then(function (response) {
                    bill = response.data;
                })
            }

            var idBill = bill[0].id;
            if (bill.length != 0) {
                $http.get('http://localhost:3000/billDetail/?idBill=' + idBill)
                    .then(function (response) {
                        var billDetail = response.data;
                        // console.log(billDetail);
                        billDetail.forEach(item => {
                            $http.get('http://localhost:3000/products/?id=' + item.idProduct)
                                .then(function (response) {
                                    var products = response.data;
                                    // console.log(products);
                                    var billDetail = {
                                        "idBillDetail": item.id,
                                        "idBill": bill[0],
                                        "idProduct": products,
                                        "size": item.size,
                                        "quantity": item.quantity
                                    }
                                    // console.log(billDetail);
                                    $rootScope.lstCart.push(billDetail)
                                    //tổng tiền
                                    $rootScope.TotalMoney = $rootScope.TotalMoney + (products[0].price * item.quantity);
                                });
                        });
                    })
            }

        })
    console.log($rootScope.lstCart);
    //Delete BillDetail
    $scope.deleteBillDetail = function (id) {

        $http.delete('http://localhost:3000/billDetail/' + id)
            .then(function (response) {
                alert("delete ok")
            })
    }
    // console.log("idBill"+ idBill);
    //DeleteBillDetail
    //Payment-=
    $scope.address = $rootScope.user;
    $scope.payProduct = function (id) {
        $rootScope.lstCart.forEach(item => {
            
            console.log(item);
            var listBillDetail = [];
            $http.get('http://localhost:3000/billDetail/?idBill='+item.idBill.id+'&idProduct='+item.idProduct[0].id+'&size='+item.size)
            .then(response => {
                listBillDetail = response.data;
                // console.log(listBillDetail);
                listBillDetail.forEach(billDetail => {
                    console.log(billDetail);

                    $http.get('http://localhost:3000/products/'+item.idProduct[0].id).then(function (response) {
                        var product = response.data;
                        product.quantity = product.quantity - billDetail.quantity
                        product.sold = product.sold + billDetail.quantity
                        $http.put('http://localhost:3000/products/'+item.idProduct[0].id, product)
                    })
                })
                
            })


        })
        var billPay = bill[0];
        billPay.datePay = new Date();
        billPay.status = 1;
        billPay.money = $rootScope.TotalMoney;
        console.log(billPay);
        $http.put('http://localhost:3000/bill/' + billPay.id, billPay)
        .then(function (response) {

                   //Tạo bill newV2
                    var billNew = {
                        idUser: idUser,
                        money: 0,
                        dateCreate: new Date(),
                        datePay: "01/01/1990",
                        status: 0
                    };
                    $http.post('http://localhost:3000/bill/', billNew).then(function (response) {
                        console.log(response.data);
                    });
                    $http.get('http://localhost:3000/bill/?idUser=' + idUser + '&status=0').then(function (response) {
                        bill = response.data;
                    })
                
        })
        .then(function (response) {
            alert("Thanh Toán ok")
            $location.path('home')
        })
        


    }
    $scope.updateBillDetail = function (cart) {
        console.log(cart);
        var billDetail = {};
        $http.get('http://localhost:3000/billDetail/' + cart.idBillDetail)
            .then(function (response) {
                billDetail = response.data;
                console.log(billDetail);
                billDetail.quantity = cart.quantity
                $http.put('http://localhost:3000/billDetail/' + billDetail.id, billDetail)
                    .then(function (response) {
                        console.log(response.data);
                    })
            })
    }

    $scope.payBillDetail = function () {
        if ($rootScope.countCart == 0) {
            alert("Giỏ Hàng Khổng Có Sản Phẩm");
        } else {
            $location.path("/pay");
        }
    }


});


// cartLength
app.controller('cartLength', function ($scope, $rootScope, $http) {
    // var idUser = $rootScope.user.id;


    // $http.get('http://localhost:3000/bill/?idUser=' + idUser + '&status=0')

    // .then(function (response) {
    //     var bill = response.data;
    //     var idBill = bill[0].id;
    //     $http.get('http://localhost:3000/billDetail/?idBill=' + idBill).then(function (response) {

    //         $scope.soLuongSp = 100;

    //         console.log("asscasx");
    //         console.log($scope.soLuongSp);
    //     })
    // })





});
















