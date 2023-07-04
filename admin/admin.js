// getNAme File omghttp://localhost:3000/
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

// var app = angular.module('myApp', ['ngRoute']);
app.controller('myController', function($scope, $rootScope,$http){
    $scope.totalAccount = 0;
    $http.get('http://localhost:3000/users/').then(function(response){
        $scope.totalAccount = response.data.length;
    })

    $scope.totalProduct = 0;
    $http.get('http://localhost:3000/products/').then(function(response){
        $scope.totalProduct = response.data.length;
    })


});
//Admin 
//account
app.controller('accountController', function($scope, $rootScope,$http,$location){
    $scope.form_addUser = {
            name: "",
            email: "",
            password: "",
            birthday: "",
            avatar: "",
            address: "",
            gender: true,
            role: 1
    };
    $scope.form_updateUser = {
        name: "",
        email: "",
        password: "",
        birthday: "",
        avatar: "",
        address: "",
        gender: "",
        role: 1
};


    var api = 'http://localhost:3000/users/';
    $scope.listUsers = [];
    $http.get(api).then(function(response){
        $scope.listUsers = response.data;
    })


    $scope.addUser = function (event) {
        $scope.form_addUser.avatar = nameFile[0];
        if ($scope.form_addUser.avatar == undefined) {
            $scope.form_addUser.avatar = 'icon.png';
        }
        $http.post(api, $scope.form_addUser).then(function(response){
            alert('Thêm ok')
            event.preventDefault();
            return false;
        })
    }

    $scope.deleteUser = function (event, index) {
        event.preventDefault(); // Ngăn chặn mặc định

        var user = $scope.listUsers[index];
        $http.delete(api+user.id).then(function(response){
            event.preventDefault(); // Ngăn chặn mặc định
            return false;
            $location.replace();
        })
    }



    $scope.detailUser = function (index){
        var user = $scope.listUsers[index];
        $scope.form_updateUser.name = user.name;
        $scope.form_updateUser.email = user.email;
        $scope.form_updateUser.password = user.password;
        $scope.form_updateUser.birthday = new Date(user.birthday);
        $scope.form_updateUser.address = user.address;
        $scope.form_updateUser.avatar = user.avatar;
        $scope.form_updateUser.role = user.role;
        $scope.form_updateUser.gender = user.gender;

        $scope.updateUser = function () {
            var user = $scope.listUsers[index]
            $scope.form_updateUser.avatar = nameFile[0];
            if ( $scope.form_updateUser.avatar == undefined) {
                $scope.form_updateUser.avatar = user.avatar;
            }
            $http.put(api+user.id, $scope.form_updateUser).then(function(response){
    
            })
    
        }
    }
    

});



//Product
app.controller('productController', function ($scope,$http) {
    var api = "http://localhost:3000/products/";
    $scope.listProducts = [];
    $http.get(api).then(function(response){
        $scope.listProducts = response.data;
    })
    $scope.listCategories = [];
    $http.get('http://localhost:3000/categories/').then(function(response){
        $scope.listCategories = response.data;
    })


    $scope.from_addProduct = {
        name: "",
        img: [],
        category  : 0,
        quantity: 0,
        price: 0,
        sold: 0,
        description: "",
        status: 0,
        dateCreate: new Date()
    }
    $scope.from_updateProduct = {
        name: "",
        img: [],
        category  : 0,
        quantity: 0,
        price: 0,
        sold: 0,
        description: "",
        status: 0,
        dateCreate: new Date()
    };


    // add
    $scope.addProduct = function(){
        $scope.from_addProduct.img = nameFile;
        if ($scope.from_addProduct.img.length == 0) {
            $scope.from_addProduct.img = ['no.jpg'];
        }
        $http.post(api, $scope.from_addProduct).then(function(response){
            alert('Thêm ok')
            $scope.listProducts = response.data
        })
    }

    //delete
    $scope.deleteProduct = function(index){
        var product = $scope.listProducts[index];
        $http.delete(api+product.id).then(function(response){
            alert('Delete ok')
            $scope.listProducts = response.data
        })
    }
    //detail
    $scope.detailProduct = function(index){
        var product = $scope.listProducts[index];
        $scope.from_updateProduct.name = product.name;
        // $scope.from_updateProduct.img = product.img;
        $scope.from_updateProduct.category = product.category;
        $scope.from_updateProduct.quantity = product.quantity;
        $scope.from_updateProduct.price = product.price;
        $scope.from_updateProduct.sold = product.sold;
        $scope.from_updateProduct.description = product.description;
        $scope.from_updateProduct.status = product.status;
        $scope.from_updateProduct.dateCreate = product.dateCreate;

        $scope.updateProduct = function(){

            $scope.from_updateProduct.img = nameFile;
            var product = $scope.listProducts[index]
            if ($scope.from_updateProduct.img.length == 0) {
                $scope.from_updateProduct.img = product.img;
            }
            $http.put(api+product.id, $scope.from_updateProduct).then(function(response){
                alert("ok")
            })
        }
        

    }

});



//category

app.controller('categoryController', function ($scope,$http) {
    var api = "http://localhost:3000/categories/";
    $scope.listCategories = [];
    $http.get(api).then(function(response){
        $scope.listCategories = response.data;
    })

    $scope.form_addCategory = {
        name: "",
        description: ""
    };
    $scope.form_updateCategory = {
        name: "",
        description: ""
    };
    //adđ
    $scope.addCategory = function(){
        $http.post(api, $scope.form_addCategory).then(
            function(response){
                alert('Thêm ok')
                $scope.listCategories = response.data
            }
        )
    }

    //delete
    $scope.deleteCategory = function(event,index){
        event.preventDefault();
        var category = $scope.listCategories[index];
        $http.delete(api+category.id).then(function(response){
            
            $scope.listCategories =response.data
            alert('delete ok')
        })
    }
    //detail
    $scope.detailCategory = function(index){
        var category = $scope.listCategories[index];
        console.log(category);
        $scope.form_updateCategory.name = category.name;
        $scope.form_updateCategory.description = category.description;
        $scope.updateCategory = function(){
            var category = $scope.listCategories[index]
            $http.put(api+category.id, $scope.form_updateCategory).then(function(response){
            })
    }};

})

//Oder_details

app.controller('oderDetailsController',function($scope,$http){
    $scope.listBills = [];
    
    $http.get('http://localhost:3000/bill/')
    .then(function(response){
        var bills = response.data;
        bills.forEach(item => {
            var tempBill = {}
            tempBill.id = item.id;
            tempBill.money = item.money;
            tempBill.status =item.status;
            tempBill.datePay =item.datePay;
            tempBill.dateCreate =item.dateCreate;
            //get user
            $http.get('http://localhost:3000/users?id='+item.idUser)
            .then(function(response){
                tempBill.idUser = response.data;
            })
            //getProducts
            var lstBillDetail = [];
            $http.get('http://localhost:3000/billDetail/?idBill='+item.id).then(function(response){
                lstBillDetail = response.data;
                var billDetailTemp = [];
                lstBillDetail.forEach(item => {
                    $http.get('http://localhost:3000/billDetail/?idBill='+item.idBill+'&size='+item.size)
                    .then(function(response){
                        var sizeBillDetail = response.data;
                       
                        
                        $http.get('http://localhost:3000/products/?id='+sizeBillDetail[0].idProduct).then(function(response){
                            
                            sizeBillDetail[0].idProduct = response.data;
                        })
                        billDetailTemp.push(sizeBillDetail)
                    })

                    // console.log(item);
                })
                tempBill.billDetail = billDetailTemp;
                // tempBill.product = lstProduct
            });
            // console.log(item);
            // console.log(tempBill);
            $scope.listBills.push(tempBill);
        });
        console.log($scope.listBills);
    })
});
