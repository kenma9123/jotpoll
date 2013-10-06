<?php

Class Poll
{
    function __construct()
    {

    }

    public static function save( $formID = null, $questionID = null, $settings = null )
    {
        if ( is_null($formID) ) throw new Exception("Form ID is missing");
        if ( is_null($questionID) ) throw new Exception("Question ID is missing");
        if ( is_null($settings) ) throw new Exception("Poll options is missing");

        $user = User::getUserData();
        $_db = new MySQL(MYSQL_CONNECTION);
        $table = 'poll_options';
        $result = false;

        $commonValues = array(
            'uid' => $user['id'],
            'form_id' => $formID,
            'question_id' => $questionID
        );

        $commonWhere = "`uid` = :uid AND `form_id` = :form_id AND `question_id` = :question_id";

        //check if a same data exist
        $stmt = $_db->query("SELECT `unique_id`, `form_id`, `question_id` FROM `".$table."` WHERE " . $commonWhere, $commonValues)->limit(1);
        $poll = $stmt->fetchAssoc();

        if ( $poll )
        {
            //poll already existed, UPDATE!
            $values = array('options' => json_encode($settings));
            $result = $_db->update($table, $values, $commonWhere, $commonValues);
        }
        else
        {
            //poll not existed, INSERT
            $commonValues['unique_id'] = uniqid();
            $commonValues['options'] = json_encode($settings);
            $result = $_db->insert($table, $commonValues);
        }

        return ($result) ? $poll : false;
    }
}

?>