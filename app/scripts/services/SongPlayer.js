(function() {
     function SongPlayer($rootScope, Fixtures) {
          
           /**
          * @desc Hold the Buzz song object
          * @type {Object}
          */
          
          var SongPlayer = {};

          /**
          * @desc Album object from Fixtures
          * @type {Object}
          */

          var currentAlbum = Fixtures.getAlbum();
                             
          /**
          * @desc Buzz object audio file
          * @type {Object}
          */

          var currentBuzzObject = null;

          
          /**
          * @function setSong
          * @desc Stops currently playing song and loads new audio file as currentBuzzObject
          * @param {Object} song
          */

          var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                    if(currentBuzzObject.isEnded()){
                        SongPlayer.next();                    
                    }
                });    
            });

            SongPlayer.currentSong = song;
         };

          /**
          * @function playSong
          * @desc Plays loaded currentBuzzObject audio file and sets playing song property to true
          * @param {Object} song
          */

         var playSong = function(song){
            currentBuzzObject.play();
            song.playing = true;
            
         };

          /**
          * @function playSong
          * @desc Stops loaded currentBuzzObject audio file 
          * @param {Object} song
          */

         var stopSong = function(song){
            currentBuzzObject.stop();
            song.playing = null;
         };

         /**
         * @desc Tracks the index of the song currently playing
         * @type {Object} song
         */
         
         var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
         };

         /**
         * @desc Active song object from list of songs
         * @type {Object}
         */
         
          SongPlayer.currentSong = null;

          /**
          * @desc Current playback time (in seconds) of currently playing song
          * @type {Number}
          */
          SongPlayer.currentTime = null;


           /**
          * @desc Current volume level of currently playing song
          * @type {Number}
          */
          SongPlayer.volume = null;

         /**
          * @function .play
          * @desc Decides whether to set and play new song or play a paused song
          * @param {Object} song
          */

          SongPlayer.play = function(song){
            song = song || SongPlayer.currentSong || currentAlbum.songs[0];  
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            }else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                    }
             }
          };
          
         /**
          * @function .pause
          * @desc Pauses currently playing song
          * @param {Object} song
          */

          SongPlayer.pause = function(song) {
                song = song || SongPlayer.currentSong;
                currentBuzzObject.pause();
                song.playing = false;
          };

          /**
          * @function .previous
          * @desc Navigates to previous song on the album
          * @param {Object}
          */

          SongPlayer.previous = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex--;

            if (currentSongIndex < 0) {
                var song = currentAlbum.songs[currentAlbum.songs.length - 1];
                setSong(song);
                playSong(song);
            }else {
                    var song = currentAlbum.songs[currentSongIndex];
                    setSong(song);
                    playSong(song);
             }
          };

          /**
          * @function .next
          * @desc Navigates to next song on the album
          * @param {Object}
          */
          
          SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex > (currentAlbum.songs.length -1)) {
                var song = currentAlbum.songs[0];
                setSong(song);
                playSong(song);
            }else{
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
          };

          /**
          * @function setCurrentTime
          * @desc Set current time (in seconds) of currently playing song
          * @param {Number} time
          */

          SongPlayer.setCurrentTime = function(time) {
             if (currentBuzzObject) {
                 currentBuzzObject.setTime(time);
             }
          };

          /**
          * @function volume
          * @desc Set volume level of currently playing song
          * @param {Number} volume
          */

          SongPlayer.volume = function(volume) {
             if (currentBuzzObject) {
                 currentBuzzObject.setVolume(volume);
             }
          };

          /**
          * @function .mute
          * @desc Mute volume 
          * @param {object} song
          */

          SongPlayer.mute = function(song){ 
              song = song || SongPlayer.currentSong;
              currentBuzzObject.mute();
          };

          /**
          * @function .unmute
          * @desc Unmute volume 
          * @param {object} song
          */

          SongPlayer.unmute = function(song){
              song = song || SongPlayer.currentSong;
              currentBuzzObject.unmute();
          }; 

          

          return SongPlayer;
     }
 
     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope','Fixtures', SongPlayer]);
 })();