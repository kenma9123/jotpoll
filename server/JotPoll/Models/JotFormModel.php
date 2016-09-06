<?php

namespace JotPoll\Models;

class JotFormModel {

  protected $formID;
  protected $client;
  protected $questionID;

  public function setClient(\JotPoll\JotFormClient $client) {
    $this->client = $client;
  }

  public function getClient() {
    return $this->client;
  }

  public function setFormID($formID) {
    $this->formID = $formID;
  }

  public function getFormID() {
    return $this->formID;
  }

  public function setQuestionID($questionID) {
    $this->questionID = $questionID;
  }

  public function getQuestionID() {
    return $this->questionID;
  }
}

?>