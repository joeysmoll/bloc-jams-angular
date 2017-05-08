(function() {
     function SongPlayer(Fixtures) {
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
          * @function .play
          * @desc Decides whether to set and play new song or play a paused song
          * @param {Object} song
          */

          SongPlayer.play = function(song){
            song = song || SongPlayer.currentSong;  
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
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
          * @desc Navigates to previous song on album
          * @param {Object}
          */

          SongPlayer.previous = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex--;

             if (currentSongIndex < 0) {
                 currentBuzzObject.stop();
                 SongPlayer.currentSong.playing = null;
             } else {
                    var song = currentAlbum.songs[currentSongIndex];
                    setSong(song);
                    playSong(song);
     }
          };

          return SongPlayer;
     }
 
     angular
         .module('blocJams')
         .factory('SongPlayer', ['Fixtures', SongPlayer]);
 })();