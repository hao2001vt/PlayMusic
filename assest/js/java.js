
    const openMenu  = document.querySelector('.control-menu');
    const closeMenu = document.querySelector('.close');
    const menu      = document.querySelector('.menu');
    const audio     = document.querySelector('.audio');
    const play      = document.querySelector('.play');
    const pause     = document.querySelector('.pause');
    const next      = document.querySelector('.next');
    const prev      = document.querySelector('.prev');
    const resultTime = document.querySelector('.time');
    const listMusic = document.querySelector('.list-music');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const title    = document.querySelector('.title-song');
    const img      = document.querySelector('.img-main');
    let currentIndex = 0
    openMenu.addEventListener('click', () =>{
        menu.classList.add('show')
    })
    closeMenu.addEventListener('click', () =>{
        menu.classList.remove('show')
    })
    let songs =[
        {
            src:'/assest/audio/tinh.mp3',
            title:'Tình sầu thiên thu muôn nối-X2X'
        },
        {
            src:'/assest/audio/deaf-kev-invincible.mp3',
            title:'Từng Yêu-Phan Duy Mạnh'
        },
        {
            src:'/assest/audio/neffex-grateful.mp3',
            title:'Thiệp hồng người dưng-X2X'
        },
    ]
    const player = new Audio();
    const app ={
        load :() => {
            firebase.database()
            .ref('users')
            .once('value')
            .then((snap) =>{
                songs = []
                snap.forEach((item) =>{
                    songs.push(item.val())
                })
                
            })
            .then(() =>{
                listMusic.innerHTML=''
                for(let i=0 ; i<songs.length ;i++){
                    const li = document.createElement('li');
                    li.classList.add('item-music');
                    li.setAttribute('onClick',`getItem(${i})`);
                    const img = document.createElement('img');
                    img.setAttribute('src', `${songs[i].img}`);
                    const p = document.createElement('p');
                    p.classList.add('music-title');
                    p.innerHTML= songs[i].title + ' - ' + songs[i].artist;
                    li.appendChild(img);
                    li.appendChild(p);
                    listMusic.appendChild(li)
            }
            })
        },
        play : (currentIndex) =>{
            if(player.src === "" || currentIndex !== tmp ){
                player.src= songs[currentIndex].src
                title.innerHTML=songs[currentIndex].title + '-' + songs[currentIndex].artist
                img.setAttribute('src', songs[currentIndex].img)
            }
            var tmp = currentIndex;
            player.play();
            play.style.display="none";
            pause.style.display="inline-block";
        },
        pause :() => {
            player.pause();
            play.style.display="inline-block";
            pause.style.display="none";
        },
        next :() =>{
            currentIndex++;
            if(currentIndex > songs.length -1){
                currentIndex=0
            }
            app.play(currentIndex)
        },
        prev : () =>{
            currentIndex--;
            if(currentIndex <0){
                currentIndex=songs.length-1
            }
            app.play(currentIndex)
        },
        smartTime : (time) => {
            if(time < 10){
                time = "0" + time;
            }
            return time
        }
    }
    play.addEventListener('click' , () =>{
        app.play(currentIndex)
    })
    pause.addEventListener('click' , () =>{
        app.pause()
    })
    next.addEventListener('click' , () =>{
        app.next()
    })
    prev.addEventListener('click', () =>{
        app.prev()
    })
    function getItem(index){
        app.play(index)
    }
    player.addEventListener('timeupdate' , () =>{
        let currentSeconds = app.smartTime(Math.floor((player.currentTime % 60)));
        let currentMinutes = app.smartTime(Math.floor((player.currentTime / 60)));
        let totalSeconds   = app.smartTime(Math.floor(player.duration % 60));
        let totalMinutes   = app.smartTime(Math.floor(player.duration / 60));
        let totalTime = totalMinutes + ':' + totalSeconds;
        let time = currentMinutes + ':' + currentSeconds;
        resultTime.innerHTML = time + '/' + totalTime;
        if(Math.floor(player.currentTime) === Math.floor(player.duration)){
            app.next();
        }
        progress.style.width = (player.currentTime / player.duration)*100 + "%";
    })
    progressBar.addEventListener('mousedown', (event) =>{
        let clickPosition = (event.clientX - event.target.offsetLeft)
        player.currentTime = (clickPosition/ event.target.offsetWidth) * player.duration
    }) 
    window.onload = app.load