# Quiznator

:point_right: [Dashboard](http://quiznator.herokuapp.com/dashboard)

## Usage

### Bootstrapping

Add quiz placement snippet to the your HTML page, like so:

```html
<div class="quiznator-plugin" data-quiz-id="myQuizId">
```

Replace "myQuizId" with the id of your quiz. You can get this snippet from your [quizzes](http://quiznator.herokuapp.com/dashboard/quizzes) page in the Quiznator dashboard.

Add Quiznator snippet, like so:

```html
<script src="http://quiznator.herokuapp.com/javascripts/plugin-loader.min.js"></script>
```

You only need one of these for each page.

### Set user

```javascript
// Wait for Quiznator to be ready and then set the user
document.addEventListener('quiznatorLoaded', function() {
  window.Quiznator.setUser({
    id: 'myUserId', // id is required
    accessToken: 'myAccessToken' // TMC access token is required
  });
});
```

### Development

To get a dev build working locally:

- clone/fork
- `npm install`
- install/configure [mongo](https://docs.mongodb.com/manual/installation/) (Default settings assumed below.)
- `mongo < create-indexes.js`
- 

        $ mongo  
        use test    
        db.oauthclients.insert({ clientID: "CLIENT_ID", clientSecret: "CLIENT_SECRET" })
        quit()
  
Choose whatever you want for CLIENT_ID and CLIENT_SECRET, as long as you use the same values in `.env`.

- edit `.env` to contain:
 
        NODE_ENV=development
        TMC_URL=<your tmc server url>
        QUIZNATOR_CLIENT_ID=CLIENT_ID
        QUIZNATOR_CLIENT_SECRET=CLIENT_SECRET
        PLUGIN_SCRIPT_URL=http://127.0.0.1:3000/javascripts/plugin.min.js
        PLUGIN_STYLE_URL=http://127.0.0.1:3000/stylesheets/plugin.min.css
        MONGO_URI=mongodb://127.0.0.1:27017/test
        API_URL=http://127.0.0.1:3000
        PORT=3000

**NOTE**: presumes `.env` to preside one level UP (ie. `../.env`). If you want to use `.env` in the same directory, edit `gulpfile.js` and `bin/www` accordingly. 