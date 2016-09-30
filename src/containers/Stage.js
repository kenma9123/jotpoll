import React, { Component, PropTypes } from 'react';
import { JOTFORM_COOKIE_AUTH, FORMPICKER_LIMIT } from '../config';
import DocumentTitle  from 'react-document-title';
import Granim from 'granim';
import keenActions from '../actions/keenActions';
import Color from 'color';
import Link from 'react-router/lib/Link';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';

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

function requireDefault(module) {
  return isUndefined(module.default) ? module : module.default;
}

class Stage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      JFauth: true,
      errored: false
    };
  }

  componentWillReceiveProps(nextProps) {
    // if user is not ready - or no details
    // then fetch the user details
    if (isEmpty(nextProps.user.error) && !isEmpty(nextProps.user.apikey) &&
      !nextProps.user.isLoggedIn && !nextProps.user.isLoggingIn) {
      this.props.actions.loginUser(nextProps.user.apikey);
    }

    // load form list if empty
    if (isEmpty(nextProps.forms.error)) {
      if (isEmpty(nextProps.forms.items) && nextProps.user.isLoggedIn && !nextProps.forms.isFetching) {
        this.loadUserForms(nextProps.user.apikey, 0, FORMPICKER_LIMIT);
      }
    } else {
      console.error("Form error", nextProps.forms.error);
      this.setState({
        errored: true
      });
    }
  }

  componentWillMount() {
    console.log('Stage will mount', require('../components/Walkthrough'));
    require.ensure([], () => {
      const Walkthrough = requireDefault(require('../components/Walkthrough'));
      console.log('Walkthrough', <Walkthrough/>);
    });
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
             ['#4CAAF6', '#545da9'],
             ['#5C91BC', '#83C8D3'],
           ]
         }
       }
    });

    // record keep event
    keenActions.recordEvent('pageviews', {
      title: 'JotPoll Stage'
    });

    if (!this.props.user.isLoggedIn) {
      if (typeof JF === 'undefined') {
        throw new Error("JotForm SDK is missing");
      }

      // call Jotform js
      //init JF
      JF.init({
        enableCookieAuth: JOTFORM_COOKIE_AUTH,
        appName: 'JotPoll',
        accessType: 'read',
        authType: 'login'
      });

      // login user if API key is missing
      if (!JF.getAPIKey()) {
        this.jfAuth();
      } else {
        console.log('Already loggedin with API key', JF.getAPIKey());
        this.jfAuthSuccess();
      }
    }
  }

  jfAuthSuccess() {
    // update state
    this.setState({
      JFauth: false
    }, () => {
      keenActions.recordEvent('jotformLogins', {
        user: JF.getAPIKey(),
        rejected: false
      });

      // set the user api key
      this.props.actions.setUserAPIkey(JF.getAPIKey());
    });
  }

  jfAuth() {
    JF.login(() => {
      // if api key is present proceed to
      // weebly redirect
      if (JF.getAPIKey()) {
        console.log('JF login success with API key', JF.getAPIKey());
        this.jfAuthSuccess();
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
      keenActions.recordEvent('jotformLogins', {
        rejected: true
      });
      window.location.reload();
    });
  }

  savePollChart() {
    const { user, forms, questions, chart, poll } = this.props;

    keenActions.recordEvent('chartSaved', {
      formID: forms.selected.id,
      questionID: questions.selected.qid,
      chartType: chart.type
    });

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

  loadUserForms(apikey, offset, limit) {
    this.props.actions.fetchAndFilterForms(apikey, offset, limit);
  }

  refreshUserForms(apikey, offset, limit) {
    this.props.actions.refreshForms(apikey, offset, limit);
  }

  getLoadingMessage() {
    if (this.state.errored) {
      return 'Something went wrong, please reload the page.';
    } else {
      return this.randomLoadingMessage();
    }
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
            onLoadMore={(offset, limit) => this.loadUserForms(user.apikey, offset, limit)}
            onRefresh={(offset, limit) => this.refreshUserForms(user.apikey, offset, limit)}
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
          wrapperClass={ this.state.JFauth ? 'bounceInUp animated' : 'fadeIn animated' }
          text={this.getLoadingMessage()}
          spinnerName="rotating-plane"
          noFadeIn={true}
          before={<Logo />}
          position={ this.state.JFauth ? 'bottom' : 'middle' }
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
