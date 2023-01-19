var slide_show = document.querySelector('.slide-show')
var slide = document.querySelectorAll('.slide')
var btnNext = document.querySelector('#next')
var btnPre = document.querySelector('#pre')
var i =0
function next(){
    if(i < slide.length-1){
        i++
    }else {
        i = 0
    }
    slide_show.style.transform = `translateX(${-400*i}px)`
}
function pre(){
    if(i === 0){
        i = slide.length - 1
    }else {
        i--
    }
    slide_show.style.transform = `translateX(${-400*i}px)`
}

btnNext.addEventListener('click', function(){
    next()
})

btnPre.addEventListener('click', function(){
    pre()
})

setInterval(() => {
    next()
}, 3000);