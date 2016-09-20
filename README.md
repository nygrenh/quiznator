# Quiznator

:point_right: [Dashboard](http://quiznator.herokuapp.com/dashboard)

## Usage

### Bootstrapping

Add quiz placement snippet to the your HTML page, like so:

```
<div class="quiznator-plugin" quiz-id="myQuizId">
```

Replace "myQuizId" with the id of your quiz. You can get this snippet from your [quizzes](http://quiznator.herokuapp.com/dashboard/quizzes) page in the Quiznator dashboard.

Add quiznator snippet, like so:

```
<script src="http://quiznator.herokuapp.com/javascripts/plugin-loader.min.js"></script>
```

You only need one of these for each page.

### Set user

```
// Wait for Quiznator to be ready and then set the user
document.addEventListener('quiznatorLoaded', function() {
  window.Quiznator.setUser({
    id: 'myUserId' // id is required for user
  });
});
```
