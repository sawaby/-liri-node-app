//twitter module
var Twitter = require('twitter');
// requiring colors package 
var color = require("colors");
// request package
var request = require('request');
// requiring omdb api
var omdb = require('omdb');
// require keys.js to use its object variable (data)
var twitterKeys = require("./keys.js");
//make new object
var tweet = new Twitter(twitterKeys); 
//require spotify package
var spotify = require('spotify');
// require fs
var fs = require("fs");
//reading user input
var cmd = process.argv[2];
var inputQuery = process.argv[3];
// switch statement will check what the command is and calls the appropriate method
function execute(cmd){
    switch (cmd){
        case "my-tweets":
            twitts();
            break;
        case "spotify-this-song":
            songs();
            break;
        case "movie-this":
            movies();
            break;
        case "do-what-it-says":
            doThis();
            break;
    }
}
//calling the execute function to run the code
execute(cmd);

//tweets function will return last 3 tweets of the twitter, working with twitterAPI
function twitts(){
    var i = 0;
    tweet.get('statuses/user_timeline', function(error, tweets, response) {
        if(error){
            console.log(error);
            return;
        } 
        while(i<3){
            console.log("==================================");
            console.log(""); 
            console.log("Twitt: *( ".blue + tweets[i].text+")*".blue);  // The twitts.
            console.log(""); 
            console.log("Date: *( ".blue+tweets[i].created_at+")*".blue); //when it was created
            console.log(""); 
            fs.appendFile('log.txt', "\n\nTwitt: ( " + tweets[i].text+")\nDate: ( "+tweets[i].created_at+")\n",function(error){
                if(error){
                    console.error(error);
                    return;
                }
            });
            i++;
        }console.log("Data Were Saved to log.txt".green);
    });
}
//will work with .. API and will return the info about the song 
function songs(){
    // spotify
    if(inputQuery){
        spotify.search({ type: 'track', query: inputQuery, limit: '1'}, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        // pring artist name
        console.log("Artist's Name: ".blue+data.tracks.items[0].album.artists[0].name);
        // pring song name
        console.log("Song's Name: ".blue +data.tracks.items[0].name);
        // preview link
        console.log("Preview Link: ".blue+data.tracks.items[0].preview_url);
        //The album that the song is from
        console.log("Album: ".blue+data.tracks.items[0].album.name);
        //writing to file (log.txt)
        var songsToFile = "\n\nArtist's Name: "+data.tracks.items[0].album.artists[0].name+
        "\nSong's Name: "+data.tracks.items[0].name+
        "\nPreview Link: "+data.tracks.items[0].preview_url+
        "\nAlbum: "+data.tracks.items[0].album.name;
        fs.appendFile('log.txt', songsToFile, function(error){
            if(error){
                console.error(error);
                return;
            }
        });console.log("Data Were Saved to log.txt".green);
    });
    }else{
        spotify.search({ type: 'track', query: 'the sign ace of base', limit: '1' , artist: 'Ace of Base'}, function(err, data) {
            if ( err ) {
                console.log('Error occurred: '.red + err);
                return;
            }
            // pring artist name
            console.log("Artist's Name: ".blue+data.tracks.items[0].album.artists[0].name);
            // pring song name
            console.log("Song's Name: ".blue +data.tracks.items[0].name);
            // preview link
            console.log("Preview Link: ".blue+data.tracks.items[0].preview_url);
            //The album that the song is from
            console.log("Album: ".blue+data.tracks.items[0].album.name);
            //logging info
            var songsToFile = "\n\nArtist's Name: "+data.tracks.items[0].album.artists[0].name+
            "\nSong's Name: "+data.tracks.items[0].name+
            "\nPreview Link: "+data.tracks.items[0].preview_url+
            "\nAlbum: "+data.tracks.items[0].album.name;
            fs.appendFile('log.txt', songsToFile, function(error){
                if(error){
                    console.error(error);
                    return;
                }
            });console.log("Data Were Saved to log.txt".green);
        });
    }
}
//will return info about the movie
function moviesFinder(inputQuery){
   
    request('http://www.omdbapi.com/?i=tt3896198&apikey=40e9cece&plot=full&t='+inputQuery, function (error, response, body) {
        if(error){
            console.log('error:'.red, error); // Print the error if one occurred
            return;
        }

        console.log('statusCode:'.blue, response.statusCode); // Print the response status code if a response was received
        var bodyJson = JSON.parse(body);
        console.log('Title: '.blue+ bodyJson.Title +"\nYear: ".blue+bodyJson.Year+"\nRated: ".blue+bodyJson.Rated+"\nIMDB Rating: ".blue+bodyJson.imdbRating);
        console.log('Country: '.blue+ bodyJson.Country+"\nLanguage: ".blue+bodyJson.Language+"\nPlot: ".blue+bodyJson.Plot+"\nActors: ".blue+bodyJson.Actors);
        console.log("Website: ".blue+bodyJson.Website);
        //logging info
        var moviesToFile = '\n\nTitle: '+ bodyJson.Title +"\nYear: "+bodyJson.Year+"\nRated: "+bodyJson.Rated+"\nIMDB Rating: "+bodyJson.imdbRating+
        '\nCountry: '+ bodyJson.Country+"\nLanguage: "+bodyJson.Language+"\nPlot: "+bodyJson.Plot+"\nActors: "+bodyJson.Actors+
        "\nWebsite: "+bodyJson.Website;
        fs.appendFile('log.txt', moviesToFile, function(error){
            if(error){
                console.error(error);
                return;
            }
        });console.log("Data Were Saved to log.txt".green);
        console.log("===========================================".red);
    });
    
}

function movies(){
    if(inputQuery){
        moviesFinder(inputQuery);
    }else{
        moviesFinder('Mr.Nobody');
    }
}
//this function will return whatever it is said in the random.txt file
//the command in the file can be anything of the four commands and this method will be able to run it.
function doThis(){
    fs.readFile("random.txt",  "utf8", function(error, data) {
        if(error){
            console.error(error);
            return;
        }
         console.log("Data in file is: ".blue+data);
         var arr = data.split(",");
         cmd = arr[0];
         inputQuery = arr[1];
         execute(cmd);
    });
}


