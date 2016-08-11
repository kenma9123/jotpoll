<?php

namespace JotPoll;

use \JotPoll\JotForm;
use \JotPoll\Utils\AjaxHandler;
use \JotPoll\Interfaces\AjaxInterface;
use \JotPoll\Exceptions\JotPollException;

use \Exception;

class RequestServer extends AjaxHandler {

  protected $apikey;
  protected $jotform;

  public function __construct($args) {
    parent::__construct($args);

    $this->apikey = $args['apikey'];
    $this->jotform = new JotForm($this->apikey);
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
}

?>