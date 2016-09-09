import React, { Component, PropTypes } from 'react';
import DocumentTitle  from 'react-document-title';
import Granim from 'granim';
import Color from 'color';
import Link from 'react-router/lib/Link';
import isEmpty from 'lodash/isEmpty';

import FormPicker from '../components/FormPicker';
import QuestionPicker from '../components/QuestionPicker';
import PollChart from '../components/PollChart';
import UserBar from '../components/UserBar';
import Loading from '../components/Loading';
import Logo from '../components/Logo';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../actions';
import { routeActions } from 'react-router-redux';

class Stage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    // if user is not ready - or no details
    // then fetch the user details
    if (!isEmpty(nextProps.user.apikey) && !nextProps.user.isLoggedIn && !nextProps.user.isLoggingIn) {
      this.props.actions.loginUser(nextProps.user.apikey);
    }

    // load form list if empty
    if (isEmpty(nextProps.forms.items) && nextProps.user.isLoggedIn && !nextProps.forms.isFetching) {
      this.props.actions.fetchAndFilterForms(nextProps.user.apikey);
    }
  }

  componentDidMount() {
    // init granim
    var granimInstance = new Granim({
       element: '#granim-stage',
       name: 'granim',
       // direction: 'radial',
       opacity: [.7, .9],
       states : {
         "default-state": {
           gradients: [
             ['#009688', '#01CBB8'],
             ['#545da9', '#4CAAF6'],
             ['#ffae27', '#de496d'],
           ]
         }
       }
    });

    if (!this.props.user.isLoggedIn) {
      if (typeof JF === 'undefined') {
        throw new Error("JotForm SDK is missing");
      }

      // call Jotform js
      //init JF
      JF.init({
        enableCookieAuth: true,
        appName: 'JotPoll',
        accessType: 'read',
        authType: 'signup'
      });

      // login user if API key is missing
      if (!JF.getAPIKey()) {
        this.jfAuth();
      } else {
        console.log('Already loggedin with API key', JF.getAPIKey());
        this.setUserAPIkey();
      }
    }
  }

  setUserAPIkey() {
    this.props.actions.setUserAPIkey(JF.getAPIKey());
  }

  jfAuth() {
    JF.login(() => {
      // if api key is present proceed to
      // weebly redirect
      if (JF.getAPIKey()) {
        console.log('JF login success with API key', JF.getAPIKey());
        this.setUserAPIkey();
      } else {
        console.log('JF API key is empty - it seems the user registered');
        // otherwise, we have to show a button
        // to reopen the auth
        // somehow from here, the user accidentaly force the auth frame to close
        // or successfully registered
        // TODO: just automatically call reauth
        this.jfAuth();
      }
    }, (e) => {
      console.error("Error occured! App rejected by user", e);
      window.location.reload();
    });
  }

  savePollChart() {
    const { user, forms, questions, chart, poll } = this.props;
    this.props.actions.savePoll({
      apikey: user.apikey,
      formID: forms.selected.id,
      questionID: questions.selected.qid,
      options: JSON.stringify({
        type: chart.type,
        bars: poll.items.map(item => item.style)
      })
    });
  }

  randomLoadingMessage() {
    var lines = [
      "Locating the required gigapixels to render",
      "Spinning up the hamster",
      "Shovelling coal into the server",
      "Programming the flux capacitor"
    ];
    return lines[Math.round(Math.random()*(lines.length-1))];
  }

  renderContent() {
    const {
      user, forms,
      questions, chart,
      poll, actions
    } = this.props;

    if (user.isLoggedIn && forms.isLoaded) {
      return (
        <div className="fadeIn animated">
          <UserBar
            user={user}
          />
          <FormPicker
            forms={forms}
            user={user}
            actions={actions}
          />
          <QuestionPicker
            questions={questions}
            forms={forms}
            user={user}
            actions={actions}
          />
          <PollChart
            forms={forms}
            questions={questions}
            chart={chart}
            poll={poll}
            actions={actions}
            onSave={() => this.savePollChart()}
          />
        </div>
      );
    } else {
      return (
        <Loading
          className="startup"
          text={this.randomLoadingMessage()}
          spinnerName="rotating-plane"
          noFadeIn={true}
          before={<Logo />}
        />
      );
    }
  }

  render() {
    return (
      <DocumentTitle title='JotPoll'>
        <section id="stage-root" className="jotpoll section stage-main">
          <canvas id="granim-stage" className="granim"></canvas>
          { this.renderContent() }
        </section>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    forms: state.forms,
    questions: state.questions,
    chart: state.chart,
    poll: state.poll
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, ActionCreators, routeActions), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stage);
