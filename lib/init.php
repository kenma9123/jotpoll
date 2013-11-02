<?php
    // print_r( $_SERVER );
    define("MODE", ( $_SERVER['HTTP_HOST'] === 'localhost' ) ? 'dev' : 'live');
    define("BASE_URL", (MODE==="dev") ? '/jotpoll/' : '/');
    define("HTTP_URL", "http" . (($_SERVER['SERVER_PORT']==443) ? "s://" : "://") . $_SERVER['HTTP_HOST'] . BASE_URL);
    define("SCRIPT_DIR", "scripts/");
    define("ROOT", getcwd() . DIRECTORY_SEPARATOR );
    define('LIB_DIR', ROOT . "lib");

    if ( MODE === "live" )
    {
        include( LIB_DIR . "/php-closure.php");

        $scriptsListTop = array(
            SCRIPT_DIR . "lib/tools.js",
            SCRIPT_DIR . "lib/loading.js",
            SCRIPT_DIR . "lib/jstorage.js",
            SCRIPT_DIR . "lib/jminicolors.js",
            SCRIPT_DIR . "lib/clipboard/zclip.js",
            SCRIPT_DIR . "lib/rawdeflate_inflate.js",
            SCRIPT_DIR . "lib/base64.js"
        );

        $scriptsListModels = SCRIPT_DIR . "models/";
        $scriptsListViews = SCRIPT_DIR . "views/";

        $scriptsListBottom = array(
            SCRIPT_DIR . "router.js",
            SCRIPT_DIR . "maincore.js"
        );

        $c = new PhpClosure();
        $c->addFromArray($scriptsListTop)
        ->addDir($scriptsListModels)
        ->addDir($scriptsListViews)
        ->addFromArray($scriptsListBottom)
        ->hideDebugInfo()
        ->setLanguageECMA("ECMASCRIPT5")
        ->setCacheName('scripts-min')
        ->cacheDir(SCRIPT_DIR)
        ->write(false);
    }

    /**
     * Auto load function which loads all classes automatically no need to write includes for each class
     * @param object $class_name
     * @return bool
     */
    //we only need to load php
    spl_autoload_extensions('.php');
    function __autoload($className)
    {
        //list comma separated directory name
        $directory = array('lib/classes/');

        //list of comma separated file format
        $fileFormat = array('%s.php');

        foreach ($directory as $current_dir)
        {
            foreach ($fileFormat as $current_format)
            {
                $path = ROOT . $current_dir . sprintf( $current_format, $className );
                if ( file_exists( $path ) ) //if a file matched load it
                {
                    //echo $path . "\n";
                    require_once($path);
                    break;
                }
            }
        }
    }

    spl_autoload_register('__autoload');

    //start session
    if( !isset( $_SESSION ) ){
        session_start();
    }

    //start database
    define('DB_HOST', "localhost");
    define('DB_NAME', (MODE=='dev')?"_jotpoll_db":"");
    define('DB_USER', (MODE=='dev')?"root":"");
    define('DB_PASS', (MODE=='dev')?"":"");

    if( !defined('MYSQL_CONNECTION') ) {
        $conn = mysql_connect(DB_HOST, DB_USER, DB_PASS);
        mysql_select_db(DB_NAME, $conn);
        define('MYSQL_CONNECTION', $conn);
    }
?>