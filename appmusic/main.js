const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'Desxe'

const cd = $('.cd')
const playlist = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const preBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


const app = {
    currentIndex: 0,
    isRandom: false,
    isPlaying: false,
    isRepeat: false,

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Beliver',
            singer: 'imagine Dragon',
            path: './music/Believer-Live-Acoustic-Imagine-Dragons.mp3',
            image: './img/imagin_dragon_believer.jpg'
        },
        {
            name: 'Guardian',
            singer: 'audiomachine',
            path: './music/y2meta.com - Guardians of Freedom - audiomachine & GRV Music [Prelude to Calamity] (128 kbps).mp3',
            image: './img/GuardiansofFreedomaudiomachine.jpg'
        },
        {
            name: 'Xomu Lanterns',
            singer: 'Xomu',
            path: './music/y2meta.com - Xomu - Lanterns (128 kbps).mp3',
            image: './img/XomuLanterns.jpg'
        },
        {
            name: 'Butterfly',
            singer: 'Jason',
            path: './music/y2meta.com - Butterfly (Cover) - Jason - [LYRIC VIDEO] (128 kbps).mp3',
            image: './img/Butterfly.jpg'
        },
        {
            name: 'Immortal',
            singer: 'Two step from hell',
            path: './music/y2meta.com - Nightcore - Immortal (128 kbps).mp3',
            image: './img/Immortal.jpg'
        },
        {
            name: 'End of My Journey',
            singer: 'John Dreamer',
            path: './music/y2meta.com - John Dreamer - End of My Journey (128 kbps).mp3',
            image: './img/John Dreamer - End of My Journey.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties(){
        Object.defineProperty(this, 'currentSong', {
            get(){
                return this.songs[this.currentIndex]
            }
        })
    },
    hanlderEvent(){
        const cdWidth = cd.offsetWidth

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], 
        {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // xử lý phóng to thu nhỏ cd
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const cdNewWidth = cdWidth - scrollTop

            cd.style.width = cdNewWidth > 0 ? cdNewWidth + 'px':0
            cd.style.opacity = cdNewWidth / cdWidth
        }

        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }

            
            audio.onplay = function(){
                app.isPlaying = true 
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            
            audio.onpause = function(){
                app.isPlaying = false
                player.classList.remove('playing')  
                cdThumbAnimate.pause()
            }

            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            }
        }

        // xứ lý tua bài hát
        progress.oninput = function(e){
            const seekTime = e.target.value * audio.duration / 100

            audio.currentTime = seekTime
        }

        // khi next song

        nextBtn.onclick = function(){
            if (app.isRandom){
                app.randomSong()
            }else {
                app.nextSong()
            }
            audio.play()
            app.isPlaying = true 
            player.classList.add('playing')
            cdThumbAnimate.play()
            app.render()
            app.scrollToActiveSong()
        }

        // khi prev song

        preBtn.onclick = function(){
            if (app.isRandom){
                app.randomSong()
            }else {
                app.preSong()
            }
            audio.play()
            app.isPlaying = true 
            player.classList.add('playing')
            cdThumbAnimate.play()
            app.render()
            app.scrollToActiveSong()
        }
        
        // khi random song

        randomBtn.onclick = function(e){
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            randomBtn.classList.toggle('active', app.isRandom)
        }

        // khi ấn reapeat song 

        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        // Xứ lý next song khi song end

        audio.onended = function(){
            if(app.isRepeat){
                // progress.value = 0
                audio.play()
                app.render()

            }else{
                if (app.isRandom){
                    app.randomSong()
                }else {
                    app.nextSong()
                }
                audio.play()
                app.render()
            }
            app.scrollToActiveSong()
        }

        // Lắng nghe click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if ( songNode || e.target.closest('.option')){
                // xử lý khi click vào song
                if (songNode){
                    // console.log(songNode.getAttribute('data-index'))
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    app.isPlaying = true 
                    player.classList.add('playing')
                    cdThumbAnimate.play()
                    audio.play()
                }
            }
        }
    },
    scrollToActiveSong(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'center'
            })
        }, 300)
    },
    loadingConfig(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    nextSong(){
        this.currentIndex++
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    preSong(){
        this.currentIndex--
        if (this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start(){
        this.loadingConfig()

        this.defineProperties()

        this.hanlderEvent()

        this.loadCurrentSong()

        this.render()

        // hiện thị trang thái ban đầu của btnRepeat và btnRandom
        randomBtn.classList.toggle('active', app.isRandom)
        repeatBtn.classList.toggle('active', app.isRepeat)
    }
}

app.start()