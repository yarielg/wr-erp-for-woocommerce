<?php

/*
*
* @package yariko
*
*/
namespace Wrerp\Inc\Base;

class Activate{

    public static function activate(){

        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        $table_name1 = $wpdb->prefix . 'wrerp_qut';
        $table_name2 = $wpdb->prefix . 'wrerp_iqut';

        $sql1 = "CREATE TABLE $table_name1 (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          status varchar(11) NOT NULL,
          posting_date varchar(10) NOT NULL,
          customer_id int(10) NOT NULL,
          remarks varchar(300) NOT NULL,
          PRIMARY KEY  (id)
        ) $charset_collate;";

        $sql2 = "CREATE TABLE $table_name2 (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          item_id int(11) NOT NULL,
          item_id int(11) NOT NULL DEFAULT '0',
          doc_num int(11) NOT NULL,
          doc_type int(11) NOT NULL,
          PRIMARY KEY  (id)
        ) $charset_collate;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql1 );
        dbDelta( $sql2 );
    }
}
