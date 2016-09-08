<?php

namespace JotPoll;

use \JotPoll\Database\MysqliDb;
use \JotPoll\Config;
use \Exception;

class Poll {

  private $db;
  private $resultID;

  protected $apikey;
  protected $formID;
  protected $questionID;

  function __construct() {
    $this->db = new MysqliDb(array(
      'host' => Config::MYSQL_HOST,
      'username' => Config::MYSQL_USER,
      'password' => Config::MYSQL_PASS,
      'db' => Config::MYSQL_DBNAME,
      'charset' => 'utf8'
    ));
  }

  private function getPoll() {
    $this->db->join('users', '`poll`.`uid` = `users`.`id`', 'LEFT');
    $this->db->where('`poll`.`unique_id`', $this->resultID);

    $poll = $this->db->getOne('poll', implode(',', array(
      '`poll`.*',
      '`users`.`apikey`'
    )));

    // decode options
    $poll['options'] = json_decode($poll['options'], true);

    return $poll;
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
            for ($x = 1; $x <= $counts; $x++) {
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

  public function getData($resultID = false) {
    if (!$resultID) {
      throw new Exception('Result ID is missing');
    }

    $this->resultID = $resultID;
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

  public function save($data = array()) {
    $this->db->where('`poll`.`uid`', $data['uid']);
    $this->db->where('`poll`.`form_id`', $data['form_id']);
    $this->db->where('`poll`.`question_id`', $data['question_id']);
    $existed = $this->db->getOne('poll');

    // if already exist, just update
    if ($this->db->count > 0) {
      $this->db->where('id', $existed['id']);
      $this->db->update('poll', $data);
      $data = array_merge($data, $existed);
    } else {
      $data['unique_id'] = uniqid();
      $this->db->insert('poll', $data);
    }

    return $data;
  }
}

?>