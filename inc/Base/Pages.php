<?php

/*
*
* @package Yariko
*
*/

namespace Wrerp\Inc\Base;

class Pages{

    public function register(){

        add_action('admin_menu', function(){
            add_menu_page('WR ERP', 'WR ERP', 'manage_options', 'wrerp_main', array($this,'products') , WRERP_PLUGIN_URL. 'assets/images/price-tag.png',110);
        });

        add_action('admin_menu',function(){
            $wrerp_main_page = add_submenu_page( 'wrerp_dashboard', 'Dashboard', 'Dashboard','manage_options', 'wrerp_main', array($this,'dashboard'));
            add_action('load-' . $wrerp_main_page, function (){
                add_action( 'admin_enqueue_scripts',function (){
                    //Ext Styles
                    wp_enqueue_style( 'wrerp_ext_all_css', WRERP_PLUGIN_URL . '/assets/css/ext-all.css'  );
                    wp_enqueue_style( 'wrerp_extheme_css', WRERP_PLUGIN_URL . '/assets/css/xtheme-blue.css'  );

                    //WR ERP Styles
                    wp_enqueue_style( 'wrerp_main_css', WRERP_PLUGIN_URL . '/assets/css/main.css'  );

                    //Ext scripts
                    wp_enqueue_script( 'wrerp_ext_base_js', WRERP_PLUGIN_URL . '/assets/js/ext-base.js');
                    wp_enqueue_script( 'wrerp_ext_all_js', WRERP_PLUGIN_URL . '/assets/js/ext-all.js');

                    //WR ERP Scripts
                    //Inventory
                    wp_enqueue_script( 'wrerp_win_products', WRERP_PLUGIN_URL . '/assets/js/inventory/win_products.js');
                    wp_enqueue_script( 'wrerp_win_products');
                    wp_localize_script( 'wrerp_win_products', 'parameters',['ajax_url'=> admin_url('admin-ajax.php')]);
                    //Sales
                    wp_enqueue_script( 'wrerp_win_quotation', WRERP_PLUGIN_URL . '/assets/js/sales/win_quotation.js');
                    //Main
                    wp_enqueue_script( 'wrerp_left_panel_main', WRERP_PLUGIN_URL . '/assets/js/left_panel_main.js');
                    wp_enqueue_script( 'wrerp_toolbar_main', WRERP_PLUGIN_URL . '/assets/js/toolbar_main.js');
                    wp_enqueue_script( 'wrerp_ext_main_js', WRERP_PLUGIN_URL . '/assets/js/main.js');
                });
            });
        });



    }

    //Assigning the template to each page
    function dashboard(){
        require_once WRERP_PLUGIN_PATH . 'templates/dashboard.php';
    }



}
