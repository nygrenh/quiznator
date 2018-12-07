try {
  require("babel-polyfill");
} catch (e) {}

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import Dashboard from "components/dashboard";
import DashboardOpener from "components/dashboard/dashboard-opener";
import QuizLoader from "components/quiz-loader";
import store from "state/store";
import withClassPrefix from "utils/class-prefix";
import syncQuiznatorWithStore from "utils/sync-quiznator-with-store";

window.Quiznator = syncQuiznatorWithStore(store);

window.loadQuizzes = function() {
  Array.from(
    document.querySelectorAll(`.${withClassPrefix("plugin")}`)
  ).forEach(quiz => {
    render(
      <Provider store={store}>
        <QuizLoader
          id={quiz.getAttribute("quiz-id") || quiz.getAttribute("data-quiz-id")}
        />
      </Provider>,
      quiz
    );
  });
};

window.loadQuizzes()

const dashboardContainer = document.querySelector(
  `.${withClassPrefix("dashboard")}`
);

if (dashboardContainer) {
  render(
    <Provider store={store}>
      <Dashboard />
    </Provider>,
    dashboardContainer
  );
}
