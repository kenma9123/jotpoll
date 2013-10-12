<?php

/**
 * Responsible on executing Curl functions 
 * --DELETE , POST, GET etc
 */
Class Curl
{

    /**
    * Helper Functions for GET method
    */
    public static function get($url, $param = array())
    {
        $method = array('method' => 'GET');
        return self::_request($url, array_merge($param, $method));
    }
    /**
    * Helper Functions for POST method
    */
    public static function post($url, $param = array())
    {
        $method = array('method' => 'POST');
        return self::_request($url, array_merge($param, $method));
    }
    /**
    * Helper Functions for PUT method
    */
    public static function put($url, $param = array())
    {
        $method = array('method' => 'PUT');
        return self::_request($url, array_merge($param, $method));
    }

    /**
    * Helper Functions for DELETE method
    */
    public static function delete($url, $param = array())
    {
        $method = array('method' => 'DELETE');
        return self::_request($url, array_merge($param, $method));
    }

    /**
     * Make a request from a certaion parameters
     * @param string $url - The url to make a request with
     * @param array $req - An array containing the additional parameters
     * @access public
     * @return array of the request
     */
    public static function _request($url = '', $req = array())
    {
        $req = array_merge(array(
            'params' => array(),
            'headers' => array(),
            'method' => 'GET',
            'ssl' => false,
            'get_binary' => false,
            'put_file' => false,
            'put_data' => false
        ), $req);

        $options = array(
            CURLOPT_RETURNTRANSFER => true,         // return web page
            CURLOPT_HEADER         => false,        // don't return headers
            CURLOPT_CONNECTTIMEOUT => 120,          // timeout on connect
            CURLOPT_TIMEOUT        => 120,          // timeout on response
            CURLOPT_SSL_VERIFYPEER => $req['ssl'],  // verify ssl
            CURLOPT_SSLVERSION     => 3            // ssl version
        );

        // included headers
        if ( count($req['headers']) > 0 ) {
            $options[CURLOPT_HTTPHEADER] = $req['headers'];
        }

        if ( $req['method'] == 'GET' && $req['get_binary'] === true )
        {
            $options[CURLOPT_BINARYTRANSFER] = true;
        }

        if ( $req['method'] == 'PUT' AND count($req['params']) > 0 )
        {
            $options[CURLOPT_CUSTOMREQUEST] = "PUT";

            if ( $req['put_data'] ) {
                $options[CURLOPT_POSTFIELDS] = $req['params'];
            }

            if ( $req['put_file'] ) {
                // $options[CURLOPT_PUT] = true;
                $options[CURLOPT_INFILE] = $req['params']['file'];
                $options[CURLOPT_INFILESIZE] = $req['params']['fileSize'];
            }
        }

        if ( $req['method'] == 'POST' AND count($req['params']) > 0 )
        {
            $options[CURLOPT_POST] = true;
            $p = array();
            foreach ($req['params'] as $key => $value){
                if (is_string($value)) {
                    $p[] = $key."=".urlencode($value);
                }
                else {
                    $p[] = $key."=".$value;
                }
            }
            $options[CURLOPT_POSTFIELDS] = implode('&', $p);
        }

        $ch = curl_init( $url );
        curl_setopt_array( $ch, $options );
        $content = curl_exec( $ch );
        $err     = curl_errno( $ch );
        $errmsg  = curl_error( $ch );
        $header  = curl_getinfo( $ch );
        curl_close( $ch );
    
        $header['errno']   = $err;
        $header['errmsg']  = $errmsg;
        $header['content'] = $content;
        return $header;
    }
}

?>