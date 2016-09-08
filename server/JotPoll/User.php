<?php

namespace JotPoll;

use \JotPoll\Database\MysqliDb;
use \JotPoll\Config;
use \Exception;

class User {

  private $db;
  public $existed;
  public $data = array();

  private $whereKey;
  private $whereVal;

  public function __construct() {
    $this->db = new MysqliDb(
      array(
      'host' => Config::MYSQL_HOST,
      'username' => Config::MYSQL_USER,
      'password' => Config::MYSQL_PASS,
      'db' => Config::MYSQL_DBNAME,
      'charset' => 'utf8'
    ));
  }

  public function set($key, $value) {
    if (!isset($this->data[$key])) {
      $this->data[$key] = $value;
    }
  }

  public function getFilter($key, $value) {
    $rel = $this->exist($key, $value);
    return ($rel) ? $this->existed : false;
  }

  public function getData() {
    return $this->data;
  }

  public function where($key, $value) {
    $this->whereKey = $key;
    $this->whereVal = $value;
  }

  public function insert() {
    $id = $this->db->insert('users', $this->data);
    return $id;
  }

  public function exist($key, $value) {
    $this->where($key, $value);
    $this->db->where($key, $value);
    $this->existed = $this->db->getOne('users');
    return ($this->db->count > 0) ? true : false;
  }

  public function update() {
    $this->db->where($this->whereKey, $this->whereVal);
    $this->db->update('users', $this->data);
    return $this->existed['id'];
  }
}

?>