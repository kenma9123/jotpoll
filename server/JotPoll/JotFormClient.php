<?php

namespace JotPoll;

use \JotPoll\JotForm;

class JotFormClient extends JotForm {

  private $apikeyValid = false;
  private $error;

  public function __construct($apiKey = "", $outputType = "json", $debugMode = false) {
    // contruct parent
    parent::__construct($apiKey, $outputType, $debugMode);

    $this->start();
  }

  private function start() {
    // returns settings if api key is valid
    $settings = $this->getUserSettings();
    if ($settings) {
      // we got settings, api key is still valid
      $this->apikeyValid = true;

      // detect if EU account based from the settings
      if ($this->isEUOnly($settings)) {
        // set api endpoint to EU
        $this->setAPIUrlToEU();
      }
    }
  }

  private function getUserSettings() {
    try {
      return $this->getSettings();
    } catch (JotFormException $e) {
      if ($e->getCode() !== 200) {
        $this->error = $e;
        return false;
      }
    }
  }

  public function isApiKeyValid() {
    return $this->apikeyValid;
  }

  public function getError() {
    return $this->error;
  }

  /**
  * [isEUOnly Checks if the user data stored on Europe Datacenter]
  * @return [boolean]  [Returns true or false]
  */
  public function isEUOnly($settings) {
    return (isset($settings) && isset($settings['euOnly'])) ? true : false;
  }

  /**
  * [setAPIUrl Set the API base URL]
  * @return [void]
  */
  public function setAPIUrl($url) {
    $this->baseURL = $url;
  }

  /**
  * [setAPIUrlToEU Set the API base URL to EU server]
  * @return [void]
  */
  public function setAPIUrlToEU() {
    $this->setAPIUrl("https://eu-api.jotform.com");
  }

  /**
  * [getBaseUrl get the current ]
  * @return [String]  [Returns API base url]
  */
  public function getBaseUrl() {
    return $this->baseURL;
  }
}

?>