<?php

/*
*
* @package yariko


Plugin Name:  WR ERP FOR WOOCOMMERCE
Plugin URI:   https://www.webreadynow.com/en/wr_erp_for_woocommerce
Description:  Description here
Version:      1.0.0
Author:       Web Ready Now
Author URI:   https://webreadynow.com/
Tested up to: 5.2.3
Text Domain:  wr_erp_for_woocommerce
Domain Path:  /languages
*/

defined('ABSPATH') or die('You do not have access, sally human!!!');


if( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php') ){
    require_once  dirname( __FILE__ ) . '/vendor/autoload.php';
}

define('WRERP_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define('WRERP_PLUGIN_URL' , plugin_dir_url(  __FILE__  ) );
define('WRERP_ADMIN_URL' , get_admin_url() );
define('WRERP_PLUGIN_DIR_BASENAME' , dirname(plugin_basename(__FILE__)) );

if( class_exists( 'Wrerp\\Inc\\Init' ) ){
    register_activation_hook( __FILE__ , array('Wrerp\\Inc\\Base\\Activate','activate') );
    Wrerp\Inc\Init::register_services();
}