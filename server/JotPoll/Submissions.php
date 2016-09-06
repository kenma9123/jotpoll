<?php

namespace JotPoll;

use \JotPoll\Models\JotFormModel;
use \JotPoll\JotFormClient;
use \Exception;

class Submissions extends JotFormModel {

  private $minoffset = 0;
  private $maxLimit = 1000;

  public function __construct(JotFormClient $jotformClient, $formID = false) {
    if ($jotformClient) {
      $this->setClient($jotformClient);
    }

    if ($formID) {
      $this->setFormID($formID);
    }
  }

  public function getAll() {
    // get the form data to check for submission counts
    $forms = $this->getClient()->getForm($this->getFormID());

    // check if submission count is greater than max limit count
    // if so, pull every submissions
    $submissions_count = (int) $forms['count'];

    //request the submission
    $submissions = array();
    $loopCount = ceil($submissions_count / $this->maxLimit);

    for ($x = $this->minoffset; $x < $loopCount; $x++ ) {
      $offset = ($x * $this->maxLimit);
      $result = $this->getClient()->getFormSubmissions($this->formID, $offset, $this->maxLimit, array('status' => 'ACTIVE'));
      $submissions = array_merge($submissions, $result);
    }

    return $submissions;
  }
}
class SubmissionsException extends Exception{}

?>