var slide = document.querySelector('.slide')
var btnNext = document.querySelector('.next')
var btnPre = document.querySelector('.previous')
var img = ['https://www.vascara.com/uploads/banner/2023/January/16/16111673863357.jpg',
'https://www.vascara.com/uploads/banner/2023/January/16/16131673863675.png',
'https://www.vascara.com/uploads/banner/2023/January/12/16071673515314.jpg',
'https://www.vascara.com/uploads/banner/2022/December/31/15161672467372.jpg'
];
var i = 0
function next(){
    if(i < img.length - 1){
        i++
    }else{
        i = 0
    }
    slide.src = `${img[i]}`
}
function previous(){
    if(i === 0){
        i = img.length -1
    }else{
        i--
    }
    slide.src = `${img[i]}`
}
btnNext.addEventListener('click', next)

btnPre.addEventListener('click', previous)

setInterval(function(){
    next()
}, 5000)

var iarrow = document.getElementById('iArrow')
var modal_location = document.querySelector('.modal-location')
var select = document.querySelector('.modal select')
var btnSubmit = document.getElementById('submit') 
var locationText = document.getElementById('location')
function submitLocation(){
    locationText.innerText = select.options[select.selectedIndex].text
    modal_location.classList.toggle('hide')
}
iarrow.addEventListener('click', function(){
    modal_location.classList.toggle('hide')
})
btnSubmit.addEventListener('click', submitLocation)

