<?php

namespace Wrerp\Inc\Controller;
use Wrerp\Inc\Controller\QuotationsController;
class ProductsController{

    public function register(){

        add_action( 'wp_ajax_get_all_products', array($this,'getProducts' ));
        add_action( 'wp_ajax_get_products_by_quo_id', array($this,'getProductsByQuotationId' ));
    }

    function getProducts(){
        global $wpdb;
        $search = isset($_POST['search']) ? sanitize_text_field($_POST['search']) : '';
        $products = $wpdb->get_results("SELECT * FROM $wpdb->prefix" . "posts  LEFT JOIN $wpdb->prefix" . "postmeta ON ID=post_id WHERE post_type IN ('product','product_variation') AND post_status NOT IN ('auto-draft','trash') AND meta_key = '_sku' AND LOWER(meta_value) LIKE '%".$search."%' ORDER BY ID",ARRAY_A);
        $final_products = array();
        //adding stocks columns to product
        foreach ($products as $product){
            $stock = $this->getStockByID($product['post_id']);
            $product['_manage_stock'] = isset($stock[0]['meta_value']) ? $stock[0]['meta_value'] : 'no';
            $product['_stock'] = isset($stock[1]['meta_value']) ? $stock[1]['meta_value'] : 0;
            $product['_stock_status'] = isset($stock[2]['meta_value']) ? $stock[2]['meta_value'] : 'outofstock';
            $product['price'] = $this->getPrice($product['post_id']);
            //esto es para que en win_quotation el store cargue esta columan con valor por defecto 1
            $product['quantity'] = 1;
            array_push($final_products,$product);
        }

        $result['success'] = true;
        $result['total'] = count($final_products);
        $result['data'] = $final_products;
        echo json_encode($result);
        wp_die();
    }

    function getStockByID($id){
        global $wpdb;

        $stock = $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM $wpdb->prefix" . "postmeta WHERE post_id=$id AND meta_key IN (%s,%s,%s)", '_manage_stock','_stock_status','_stock'),ARRAY_A
        );
        return $stock;
    }


    function getPrice($id){
        global $wpdb;
        $products1 = $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM $wpdb->prefix" . "postmeta WHERE post_id = %d AND meta_key = %s", $id,'_regular_price' ),ARRAY_A
        );
        $products2 = $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM $wpdb->prefix" . "postmeta WHERE post_id = %d AND meta_key = %s", $id,'_sale_price' ),ARRAY_A
        );
        $regular_price = $products1[0]['meta_value'] > 0 ? $products1[0]['meta_value'] : 0;
        $sale_price = $products2[0]['meta_value'] > 0 ? $products2[0]['meta_value'] : 0;
        return $sale_price>0?$sale_price:$regular_price;
    }

    function getSku($id){
        global $wpdb;
        $products = $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM $wpdb->prefix" . "postmeta WHERE post_id = %d AND meta_key = %s", $id,'_sku' ),ARRAY_A
        );

        if(count($products)>0){
            return $products[0]['meta_value'];
        }
        return 0;
    }

    function getproductName($id){
        global $wpdb;
        $products = $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM $wpdb->prefix" . "posts WHERE ID = %d", $id ),ARRAY_A
        );

        if(count($products)>0){
            return $products[0]['post_title'];
        }
        return 0;
    }

    function getProductsByQuotationId(){
        global $wpdb;

        $doc_num = sanitize_text_field($_POST['id']);
        $quotation_controller = new QuotationsController();
        $products = $wpdb->get_results("SELECT * FROM $wpdb->prefix" . "wrerp_iqut WHERE doc_num = '$doc_num' ORDER BY id",ARRAY_A);
        $final_products = array();
        //adding stocks columns to product
        foreach ($products as $product){
            $stock = $this->getStockByID($product['item_id']);
            $product['_manage_stock'] = isset($stock[0]['meta_value']) ? $stock[0]['meta_value'] : 'no';
            $product['_stock'] = isset($stock[1]['meta_value']) ? $stock[1]['meta_value'] : 0;
            $product['_stock_status'] = isset($stock[2]['meta_value']) ? $stock[2]['meta_value'] : 'outofstock';
            $product['price'] = $this->getPrice($product['item_id']);
            $product['meta_value'] = $this->getSku($product['item_id']);
            $product['post_title'] = $this->getproductName($product['item_id']);
            $product['ID'] = $product['item_id'];
            //esto es para que en win_quotation el store cargue esta columan con valor por defecto 1
            $product['quantity'] = $product['qty'];
            array_push($final_products,$product);
        }

        $result['success'] = true;
        $result['total'] = count($final_products);
        $result['data'] = $final_products;
        $result['doc_state'] = $quotation_controller->getDocStatus($doc_num);
        echo json_encode($result);
        wp_die();
    }
}
