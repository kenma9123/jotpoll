<?php

namespace JotPoll;

use \JotPoll\Models\JotFormModel;
use \JotPoll\JotFormClient;
use \Exception;

class Question extends JotFormModel {

  public function __construct(JotFormClient $jotformClient, $formID = false, $questionID = false) {
    if ($jotformClient) {
      $this->setClient($jotformClient);
    }

    if ($formID) {
      $this->setFormID($formID);
    }

    if ($questionID) {
      $this->setQuestionID($questionID);
    }
  }

  public function get() {
    return $this->getClient()->getFormQuestion($this->getFormID(), $this->getQuestionID());
  }
}
class QuestionException extends Exception{}

?>