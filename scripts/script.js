new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Become God",
          artist: "Ghost Data",
          cover: "https://i.scdn.co/image/ab67616d0000b273752ca195e6ebcd5cb88cab2f",
          source: "https://necrozma.vercel.app/mp3/1.mp3",
          url: "https://www.youtube.com/watch?v=SlMGo85AhGo",
          favorited: false
        },
        {
          name: "Consumer Friendly",
          artist: "JellyBear",
          cover: "https://i.scdn.co/image/ab67616d0000b2735c977e008a0b795227927877",
          source: "https://necrozma.vercel.app/mp3/2.mp3",
          url: "https://www.youtube.com/watch?v=28A4yF6gqWU",
          favorited: false
        },
        {
          name: "Wobble",
          artist: "Crankdat & Tisoki",
          cover: "https://i1.sndcdn.com/artworks-000589068161-4azrne-t500x500.jpg",
          source: "https://necrozma.vercel.app/mp3/3.mp3",
          url: "https://www.youtube.com/watch?v=TBiJ-RAmCB4",
          favorited: false
        },
        {
          name: "Mind Control",
          artist: "Computa",
          cover: "https://i1.sndcdn.com/artworks-000603236191-puxodi-t500x500.jpg",
          source: "https://necrozma.vercel.app/mp3/4.mp3",
          url: "https://open.spotify.com/track/34ilCZXFuUBaarNaYBXj5y?autoplay=true",
          favorited: false
        },
        {
          name: "Cocktail Queen",
          artist: "Mellefresh, deadmau5",
          cover: "https://i.scdn.co/image/5a3e91a4c68c7d587937470e789fa20ee2382977",
          source: "https://necrozma.vercel.app/mp3/5.mp3",
          url: "https://www.youtube.com/watch?v=pm3wht6JVrs",
          favorited: false
        },
        {
          name: "Helikopter",
          artist: "Blackstripe",
          cover: "https://i.scdn.co/image/ab67616d0000b273da7f4f583a7db4994195a61e",
          source: "https://necrozma.vercel.app/mp3/6.mp3",
          url: "https://www.youtube.com/watch?v=xfqrWaquaTg",
          favorited: false
        },
        {
          name: "CHAOS",
          artist: "MUST DIE!",
          cover: "https://i1.sndcdn.com/artworks-000532880637-69qqtd-t500x500.jpg",
          source: "https://necrozma.vercel.app/mp3/7.mp3",
          url: "https://www.youtube.com/watch?v=LplkeM206Xs",
          favorited: false
        }
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});
