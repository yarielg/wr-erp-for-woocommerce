<?php


namespace Wrerp\Inc\Controller;


class QuotationsController
{

    public function register(){

        add_action( 'wp_ajax_insert_quo', array($this,'createQuotation' ));
        add_action( 'wp_ajax_get_doc_id', array($this,'getDocId' ));
        add_action( 'wp_ajax_next_doc', array($this,'nextQuotation' ));
        add_action( 'wp_ajax_previous_doc', array($this,'previousQuotation' ));
    }

    function createQuotation(){
        $items = json_decode(stripslashes($_POST['items']));
        $posting_date = sanitize_text_field($_POST['posting_date']);
        $status = sanitize_text_field($_POST['status']);
        $customer_id = sanitize_text_field($_POST['customer_id']);
        $remarks = sanitize_text_field($_POST['remarks']);

        global $wpdb;

        $wpdb->query("INSERT INTO $wpdb->prefix" . "wrerp_qut (status,posting_date,customer_id,remarks) VALUES ('$status','$posting_date','$customer_id','$remarks')");
        $doc_id = $wpdb->insert_id;
        $row_inserted = 0;
        if($doc_id > 0){
            foreach ($items as $item){
                $wpdb->query("INSERT INTO $wpdb->prefix" . "wrerp_iqut (item_id,qty,doc_num,doc_type) VALUES ('$item->id','$item->qty',$doc_id,'1')");
                if($wpdb->insert_id > 0){
                    $row_inserted++;
                }
            }
        }
        $json_result = array();
        if($row_inserted == count($items)){
            $json_result['msg'] = 'The document was successfully saved';
            $json_result['doc_id'] = $doc_id;
            $json_result['success'] = true;
        }else{
            $json_result['msg'] = 'The document was not saved';
            $json_result['success'] = false;
        }
        echo json_encode($json_result);
        wp_die();
    }

    function getDocId(){
        global $wpdb;
        $ids = $wpdb->get_results("SELECT id FROM $wpdb->prefix" . "wrerp_qut ORDER BY id DESC", ARRAY_A);

        echo json_encode($ids[0]);
        wp_die();
    }

    function getDocStatus($id){
        global $wpdb;
        $ids = $wpdb->get_results("SELECT status FROM $wpdb->prefix" . "wrerp_qut WHERE id='$id'", ARRAY_A);

        return count($ids)>0 ? $ids[0]['status'] : -1;
    }

    function getItemsByDocNum($id){
        global $wpdb;
        $items = $wpdb->get_results("SELECT * FROM $wpdb->prefix" . "wrerp_iqut INNER JOIN $wpdb->prefix" . "posts ON (item_id = $wpdb->prefix" . "posts.ID) WHERE doc_num = '$id'  ORDER BY $wpdb->prefix" . "wrerp_iqut.id ", ARRAY_A);

        return $items;
    }

    function nextQuotation(){
        global $wpdb;
        $id = sanitize_text_field($_POST['id']);
        $ids = $wpdb->get_results("SELECT id FROM $wpdb->prefix" . "wrerp_qut ORDER BY id", ARRAY_A);
        $id_pos = array_search($id,array_column($ids, 'id'));
        if($id_pos === false || $id_pos === count($ids) - 1){
            echo json_encode($ids[0]);
        }else{
            echo json_encode($ids[$id_pos+1]);
        }
        wp_die();
    }

    function previousQuotation(){
        global $wpdb;
        $id = sanitize_text_field($_POST['id']);
        $ids = $wpdb->get_results("SELECT id FROM $wpdb->prefix" . "wrerp_qut ORDER BY id", ARRAY_A);
        $id_pos = array_search($id,array_column($ids, 'id'));
        if($id_pos === false || $id_pos === 0){
            echo json_encode($ids[count($ids)-1]);
        }else{
            echo json_encode($ids[$id_pos-1]);
        }
        wp_die();
    }

}