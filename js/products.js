// click danh sách
(function (){
    var categorysList = document.querySelectorAll('.categorys-list .list');
    categorysList.forEach(element =>{
        let childrens = element.childNodes;
        childrens[0].addEventListener('click', function (event) {
            
            categorysList.forEach(element => {
                let children = element.childNodes;
    
                if (children[0].classList.contains('activeCategory')) {
                    children[0].classList.remove('activeCategory')
                }
                
            })
    
            if (event.target.tagName === "A" || event.target.tagName === "a") {
                event.target.classList.add('activeCategory');
            }
        })
    
    });
})();

// ẩn hiện loại
(function(){
    var check = true;
    var categorysBtn = document.querySelector('.products_categorys-tile');
    var categorysList = document.querySelector('.categorys-list');
    categorysBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (check) {
            categorysList.classList.add('hide');
            check = false;
        }else{
            categorysList.classList.remove('hide');
            check = true;
        }
    });

})();




