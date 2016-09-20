<?php

namespace JotPoll;

use \JotPoll\JotForm;
use \JotPoll\JotFormClient;
use \JotPoll\Utils\AjaxHandler;
use \JotPoll\Interfaces\AjaxInterface;
use \JotPoll\Exceptions\JotPollException;

use \JotPoll\Utils\Session;

use \Exception;

class RequestServer extends AjaxHandler {

  protected $apikey;
  protected $jotform;

  public function __construct($args) {
    parent::__construct($args);

    $this->apikey = $args['apikey'];
    $this->jotform = new JotForm($this->apikey);
  }

  public function loginUser() {
    $apikey = $this->get('apikey');

    $jotform = new JotFormClient($apikey);
    if ($jotform->isApiKeyValid()) {
      // check db for email
      // and update api key accordingly
      $jUser = $jotform->getUser();
      if (isset($jUser['email'])) {
        $user = new \JotPoll\User();

        // exist or not update/insert data
        $user->set('username', $jUser['username']);
        $user->set('email', $jUser['email']);
        $user->set('apikey', $apikey);

        $result = '';
        if ($user->exist('email', $jUser['email'])) {
          $id = $user->update();
          $result = array($id => 'updated');
        } else {
          $id = $user->insert();
          $result = array($id => 'inserted');
        }

        // finally get the updated or inserted user
        $this->success("User details", array(
          'user' => array_merge($user->getData(), array('avatarUrl' => $jUser['avatarUrl'])),
          'result' => $result
        ));
      }
    } else {
      // api key is not valid
      $this->error('API key is not valid');
    }
  }

  public function formList() {
    // get the users forms
    $forms = $this->jotform->getForms($this->get('offset'), $this->get('limit'),
      $this->get('filter'), $this->get('orderby'));
    $this->success("Form list successfully fetched", array(
      'result' => $forms
    ));
  }

  public function questionList() {
    // get the questions of the form
    $questions = $this->jotform->getFormQuestions($this->get('formID'));

    // turn the objects to real array
    $questionsArr = array();
    foreach($questions as $question) {
      array_push($questionsArr, $question);
    }

    $this->success("Question list successfully fetched", array(
      'result' => $questionsArr
    ));
  }

  public function result() {
    // get the result data based from the result id
    $poll = new \JotPoll\Poll();

    $result = $poll->getData($this->get('id'));
    if (array_key_exists('error', $result)) {
      $this->error($result['error']['message'], array('code' => $result['error']['code']));
    }

    $this->success("Poll result", array(
      'result' => $result,
    ));
  }

  public function savePoll() {
    // get the user base on API key
    $user = new \JotPoll\User();
    $userObject = $user->getFilter('apikey', $this->get('apikey'));

    // save the poll
    $poll = new \JotPoll\Poll();
    $result = $poll->save(array(
      'uid' => $userObject['id'],
      'form_id' => $this->get('formID'),
      'question_id' => $this->get('questionID'),
      'options' => $this->get('options')
    ));

    $this->success("Poll saved", array(
      'result' => $result
    ));
  }

  public function testAction() {
    $this->success("Test successfull");
  }
}

?>