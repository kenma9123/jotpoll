<?php
error_reporting(E_ALL);

//global file that will automatically call the required class
require_once( __DIR__ . '/lib/init.php' );

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$httpresponse = new HttpResponse();

$request = $_POST ? $_POST : $_GET;
try
{
    switch($request['action'])
    {
        case 'handleAccount':
            if ( User::isLoggedIn() )
            {
                $userData = User::getUserData();
                $httpresponse->success("Currently logged in as " . $userData['jotform_username'], array('user_data' => $userData) );
            }

            $user = new User($request['username'], $request['email'], $request['key']);
            $response = $user->handleAccount();
            $userData = User::getUserData(false);
            $httpresponse->success($response, array('user_data' => $userData));
        break;
        case 'logout':
            Session::destroy();
            $httpresponse->success("Successfully logged out");
        break;
        case 'saveSettings':
            $result = Poll::save( $request['formID'], $request['questionID'], $request['settings'] );

            $httpresponse->success("Poll options successfully processed", array('result' => $result));
        break;
        case 'getSettings':
            try
            {
                $unique_id = $request['id'];
                $poll = Poll::fetch( $unique_id );

                if ( !$poll ) {
                    throw new Exception("No such poll existed!\nKey may already expired or revoked.\nTry to recreate your Poll.");
                }

                $poll_data = Poll::fetchPollData( $poll );

                //unset jotform apikey
                unset( $poll['jotform_apikey'] );

                $httpresponse->success("Poll options fetching status", array('poll_settings' => $poll, 'generated_poll_data' => $poll_data));
            }
            catch (Exception $e)
            {
                $message = $e->getMessage();
                $httpresponse->error($message);
            }
        break;
        default:
            $httpresponse->error("Invalid method - " . $request['action'] . " not found.");
        break;
    }
} catch (Exception $e)
{
    $httpresponse->error($e->getMessage());
}
?>
