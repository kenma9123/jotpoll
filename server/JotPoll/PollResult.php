<?php

namespace JotPoll;

use \JotPoll\Database\MysqliDb;
use \JotPoll\Config;
use \Exception;

class PollResult {

  protected $db;
  protected $resultID;

  protected $apikey;
  protected $formID;
  protected $questionID;

  function __construct($resultID = false) {
    if (!$resultID) {
      throw new Exception('Result ID is missing');
    }

    $this->resultID = $resultID;
    $this->db = new MysqliDb(array(
      'host' => Config::MYSQL_HOST,
      'username' => Config::MYSQL_USER,
      'password' => Config::MYSQL_PASS,
      'db' => Config::MYSQL_DBNAME,
      'charset' => 'utf8'
    ));
  }

  private function getPoll() {
    $this->db->join('accounts', '`poll`.`uid` = `accounts`.`id`', 'LEFT');
    $this->db->where('`poll`.`unique_id`', $this->resultID);

    $poll = $this->db->getOne('poll', implode(',', array(
      '`poll`.*',
      '`accounts`.`jotform_apikey` AS `apikey`'
    )));

    // decode options
    $poll['options'] = json_decode($poll['options'], true);

    return $poll;
  }

  private function generatePollResults($questionPoll, $submissions) {
    foreach ($submissions as $submission) {
        $answers = $submission['answers'];

        //check if the selected question is included in the answers of each submission
        if ( isset($answers[ $question_id ]) AND isset($answers[ $question_id ]['answer']) )
        {
            $qAns = $answers[ $question_id ]['answer'];

            //check wheter the qAns property is existed inside the object
            if ( isset( $pollData['results']['value'][ $qAns ] ) )
            {
                if ( $pollData['results']['value'][ $qAns ] === "" )
                {
                    $pollData['results']['value'][ $qAns ] = 0;
                }

                $pollData['results']['value'][ $qAns ]++;
            }
        }
    }

    return $pollData;
  }

  private function getQuestionPoll($question) {
    $values = array();

    // don't allow special options
    if (
      (isset($question['special']) && strtolower($question['special']) === 'none' ) ||
      !isset($question['special'])
    ) {
        // initialize each control data to have an empty data
        switch($question['type']) {
          case 'control_dropdown':
          case 'control_radio':
            $options = explode('|', $question['options']);
            foreach ($options as $option) {
              $values[$option] = 0;
            }
          break;
          case 'control_rating':
          case 'control_scale':
            $counts = ($question['type'] === 'control_rating') ? $question['stars'] : $question['scaleAmount'];
            for ($x = 0; $x < $counts; $x++) {
              $values[$x] = 0;
            }
          break;
        }
    }

    return array(
      'values' => $values,
      'type' => $question['type'],
      'name' => $question['text']
    );
  }

  public function getData() {
    $poll = $this->getPoll();

    // set api key, qid, and formid
    $this->apikey = $poll['apikey'];
    $this->formID = $poll['form_id'];
    $this->questionID = $poll['question_id'];

    // get all submissions using apikey - make sure its valid
    $jotform = new \JotPoll\JotFormClient($this->apikey);
    if (!$jotform->isApiKeyValid()) {
      return array(
        'error' => array(
          'message' => $jotform->getError()->getMessage(),
          'code' => $jotform->getError()->getCode()
        )
      );
    }

    $submissions = new \JotPoll\Submissions($jotform, $this->formID);
    $submissionData = $submissions->getAll();

    $question = new \JotPoll\Question($jotform, $this->formID, $this->questionID);
    $questionData = $question->get();
    $questionPoll = $this->getQuestionPoll($questionData);

    foreach ($submissionData as $submission) {
      $answers = $submission['answers'];

      //c heck if the selected question is included in the answers of each submission
      if (isset($answers[$this->questionID]) AND
        isset($answers[$this->questionID]['answer']) ) {

        $type = $answers[$this->questionID]['type'];
        $answer = $answers[$this->questionID]['answer'];

        // verify if still have the same type
        if ($questionPoll['type'] === $type) {
          // check wheter the answer property is existed inside the object
          if (isset($questionPoll['values'][$answer])) {
            if ($questionPoll['values'][$answer] === "") {
              $questionPoll['values'][$answer] = 0;
            }

            $questionPoll['values'][$answer]++;
          }
        }
      }
    }

    unset($submissionData);

    return array(
      'poll' => $questionPoll,
      'options' => $poll['options'],
      'others' => $poll
    );
  }
}

?>