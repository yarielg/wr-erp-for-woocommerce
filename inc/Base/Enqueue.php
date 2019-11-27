<?php

/*
*
* @package Yariko
*
*/

namespace Wrerp\Inc\Base;

class Enqueue{

    public function register(){

        add_action( 'admin_enqueue_scripts', array( $this , 'wrpl_enqueue_admin' ) ); //action to include script to the backend, in order to include in the frontend is just wp_enqueue_scripts instead admin_enqueue_scripts
       // add_action( 'wp_enqueue_scripts', array( $this, 'wrpl_enqueue_frontend'));

       // add_action('plugins_loaded', array($this,'wrpl_translate_plugin'));


    }

    /*function wrpl_translate_plugin() {
        load_plugin_textdomain( 'wr_price_list', false, WRPL_PLUGIN_DIR_BASENAME .'/languages/' );
    }*/

    /*function wrpl_enqueue_frontend(){
        //enqueue all our scripts frontend
        wp_enqueue_style('wr_frontend_main', WRPL_PLUGIN_URL . '/assets/css/front/main.css'  );

    }*/

    function wrpl_enqueue_admin(){



    }

}