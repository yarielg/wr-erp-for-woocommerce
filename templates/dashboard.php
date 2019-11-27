<?php
use Wrerp\Inc\Controller\QuotationsController;
use Wrerp\Inc\Controller\ProductsController;
require('fpdf.php');


$quotation_controller = new QuotationsController();
$product_controller = new ProductsController();

include 'reports/quotation.php';

?>

<div id="wrerp_container">

</div>
