<?php

Class Poll
{
    const TABLE = 'poll_options';

    public static function create( $questionData = null, $apikey = null )
    {
        if ( is_null($questionData) ) throw new Exception("Question object is missing");
        if ( is_null($apikey) OR !$apikey ) throw new Exception("Api key is missing");

        $answers = $questionData['answers'];
        $title = $questionData['question_title'];
        $type = 'control_radio'/*$questionData['question_type']*/;

        $questions = array(
            'type' => $type,
            'order' => 1,
            'text' => $title,
            'name' => ('1' . str_replace(' ', '_', $title) ),
            'required' => 'yes',
        );

        switch( $type )
        {
            case 'control_radio':
            case 'control_dropdown':
                //get the answers and build it
                $answersStr = implode('|', $answers);
                $questions['options'] = $answersStr;
            break;

            case 'control_rating':
            case 'control_scale':
                if ($type === 'control_rating')
                {
                    $questions['start'] = $answers;
                    $questions['starStyle'] = 'Stars';
                    $questions['defaultValue'] = 0;
                }
                else
                {
                    $questions['scaleAmount'] = $answers;
                }
            break;

        }

        //create the form data
        $form = array(
            'questions' => array(
                $questions,
                array(
                    'type' => 'control_button',
                    'order'  => 2,
                    'text' => 'Cast Vote',
                    'name' => 'submit'
                )
            ),
            'properties' => array(
                'pagetitle' => $title,
                'unique' => 'Strict'
            )
        );

        return JotForm::createForm( $form, $apikey );
    }

    public static function save( $formID = null, $questionID = null, $settings = null )
    {
        if ( is_null($formID) ) throw new Exception("Form ID is missing");
        if ( is_null($questionID) ) throw new Exception("Question ID is missing");
        if ( is_null($settings) ) throw new Exception("Poll options is missing");

        $user = User::getUserData();
        $_db = new MySQL(MYSQL_CONNECTION);
        $result = false;

        $commonValues = array(
            'uid' => $user['id'],
            'form_id' => $formID,
            'question_id' => $questionID
        );

        $commonWhere = "`uid` = :uid AND `form_id` = :form_id AND `question_id` = :question_id";

        //check if a same data exist
        $stmt = $_db->query("SELECT `unique_id`, `form_id`, `question_id` FROM `".self::TABLE."` WHERE " . $commonWhere, $commonValues)->limit(1);
        $poll = $stmt->fetchAssoc();

        if ( $poll )
        {
            //poll already existed, UPDATE!
            $values = array('options' => json_encode($settings));
            $result = $_db->update(self::TABLE, $values, $commonWhere, $commonValues);
            $poll = array_merge($poll, $values);
        }
        else
        {
            //poll not existed, INSERT
            $commonValues['unique_id'] = uniqid();
            $commonValues['options'] = json_encode($settings);
            $result = $_db->insert(self::TABLE, $commonValues);
            $poll = $commonValues;
        }

        return ($result) ? $poll : false;
    }

    public static function fetch( $unique_id = null )
    {
        if ( is_null($unique_id) ) throw new Exception("Poll identifier is missing");

        $_db = new MySQL(MYSQL_CONNECTION);
        $sql =
            "SELECT
                p.options,
                p.form_id,
                p.question_id,
                a.jotform_apikey
            FROM
                `poll_options` AS p
            INNER JOIN
                `accounts` AS a
            ON
                p.uid = a.id
            WHERE
                p.unique_id = :unique_id
            ";
        $stmt = $_db->query($sql, array('unique_id' => $unique_id ))->limit(1);
        $poll = $stmt->fetchAssoc();

        return $poll;
    }

    public static function getSubmissions( $formID, $apikey )
    {
        $minoffset = 0;
        $maxLimit = 1000;

        //get the form data to check for submission counts
        $forms = JotForm::getForm( $formID, $apikey );

        //check if submission count is greater than max limit count
        //if so, pull every submissions
        $submissions_count = (int) $forms['count'];

        //request the submission
        $submissions = array();
        $loopCount = ceil($submissions_count / $maxLimit);

        for( $x = $minoffset; $x < $loopCount; $x++ )
        {
            $offset = ( $minoffset * $maxLimit );
            $result = JotForm::getSubmissions( $formID, $apikey, $offset, $maxLimit);
            $submissions = array_merge( $submissions, $result['content'] );
        }

        return $submissions;
    }

    /**
     * Generate the Poll Results Data from the submissions of the form
     * and the selected question to be displayed on the Poll
     */
    private static function generatePollResults( $pollData, $submissions, $question_id )
    {
        foreach( $submissions as $submission )
        {
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

    private static function getQuestionPollData( $question )
    {
        $q = json_decode(json_encode($question));
        $pollDataRaw = array(
            'results' => array(
                'value' => array(),
                'name' => $q->text
            )
        );

        //don't allow special options
        if ( ( isset($q->special) && strtolower($q->special) === 'none' ) || !isset($q->special) )
        {
            //register each control data to have an empty data
            switch($q->type)
            {
                case 'control_dropdown':
                case 'control_radio':
                    $q = explode('|', $q->options);
                    for( $x = 0; $x < count($q); $x++ ) {
                        $pollDataRaw['results']['value'][ $q[$x] ] = 0;
                    }
                break;
                case 'control_rating':
                case 'control_scale':
                    $counts = ($q->type === 'control_rating') ? $q->stars : $q->scaleAmount;
                    for( $x = 1; $x <= $counts; $x++ ) {
                        $pollDataRaw['results']['value'][ $x ] = 0;
                    }
                break;
            }
        }

        return $pollDataRaw;
    }

    public static function fetchPollData($poll)
    {

        ini_set('max_execution_time', 300);

        $formID = $poll['form_id'];
        $questionID = $poll['question_id'];
        $apikey = $poll['jotform_apikey'];

        $submissions = self::getSubmissions( $formID, $apikey );
        $question = JotForm::getFormQuestion( $formID, $questionID, $apikey );
        $pollData_raw = self::getQuestionPollData( $question );
        $generatedPoll = self::generatePollResults( $pollData_raw, $submissions, $questionID );

        // return array(
        //     'submissions' => $submissions,
        //     'question' => $question,
        //     'raw' => $pollData_raw,
        //     'generated' => $generatedPoll
        // );
        return $generatedPoll;
    }
}

?>