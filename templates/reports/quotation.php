<?php

$header = array('Line', 'Sku', 'Description', 'Quantity','Price','Total');

if(isset($_GET['doc_id'])){
    $id = sanitize_text_field($_GET['doc_id']);
    ob_clean();

    $custom_logo_id = get_theme_mod( 'custom_logo' );
    $image = wp_get_attachment_image_src( $custom_logo_id , 'full' );


    $pdf = new FPDF();
    $pdf->AddPage();
    $pdf->SetFont('Arial','B',12);
    $pdf->SetFillColor(255,255,255);

    //Doc Type Name
    $pdf->Cell(200,10,'Sales Quotation',0,1,'C');

    //Company data
    $pdf->SetFont('Arial','B',9);
    $pdf->Cell(200,1,'11200 N.W 138 ST. MEDLEY, FL 33178 ',0,0,'C');
    $pdf->Ln(5);
    $pdf->Cell(200,1,'Ph: 305-513-8583 ',0,0,'C');
    $pdf->Ln(5);$pdf->Cell(200,1,'Fax: 305-452-8965 ',0,0,'C');
    $pdf->Ln(5);
    $pdf->Cell(200,1,'test@qtinet.com',0,0,'C');
    $pdf->Ln(5);

    //Doc data
    $pdf->Cell(162,1,'No: ',0,0,'R');
    $pdf->SetFont('Arial','',9);
    $pdf->Cell(200,1, $id  ,0,0,'L');
    $pdf->Ln(5);
    $pdf->SetFont('Arial','B',9);
    $pdf->Cell(162,1,'Date: ',0,0,'R');
    $pdf->SetFont('Arial','',9);
    $pdf->Cell(30,1,'11/13/2019' ,0,0,'L');

    $pdf->Image($image[0], 10, 15);
    //Start 60 line below
    $pdf->setXY(10,60);

    //Bill to
    $pdf->SetFont('Arial','B',9);
    $pdf->Cell(100,7,'Bill To:',0,0,'L');
    $pdf->Cell(100,7,'Ship To:',0,1,'L');
    $pdf->SetFont('Arial','',9);
    $pdf->Cell(100,7,'11200 N.W 138th',0,0,'L');
    $pdf->Cell(100,7,'11200 N.W 138th',0,0,'L');
    $pdf->Ln(5);
    $pdf->Cell(100,7,'Miami, FL',0,0,'L');
    $pdf->Cell(100,7,'Miami, FL',0,0,'L');
    $pdf->Ln(5);
    $pdf->Cell(100,7,'USA',0,0,'L');
    $pdf->Cell(100,7,'USA',0,0,'L');

    //Customer data
    $pdf->setXY(10,90);
    $pdf->SetFont('Arial','B',9);
    $pdf->Cell(28,7,'Customer Code:',0,0,'L');
    $pdf->SetFont('Arial','',9);
    $pdf->Cell(72,7,'CM45632',0,0,'L');
    $pdf->SetFont('Arial','B',9);
    $pdf->Cell(28,7,'Customer PO:',0,0,'L');
    $pdf->SetFont('Arial','',9);
    $pdf->Cell(72,7,'P056325',0,0,'L');
    $pdf->Ln(2);

    $pdf->SetFont('Arial','B',9);
    $w = array(10, 30, 80, 20,20,20);
    $pdf->Ln();
    for($i=0;$i<count($header);$i++){
        $pdf->Cell($w[$i],7,$header[$i],1,0,'C',true);
    }

    $pdf->Ln();
    $items = $quotation_controller->getItemsByDocNum($id);
    $pdf->SetFont('Arial','',8);
    $line =1;
    $grand_total = 0;
    foreach ($items as $item){
        $total = 0;
        $pdf->Cell(10,7,$line++,1,0,'C',true);
        $pdf->Cell(30,7,$product_controller->getSku($item['item_id']),1,0,'L',true);
        $pdf->Cell(80,7,$item['post_title'],1,0,'L',true);
        $pdf->Cell(20,7,$item['qty'],1,0,'L',true);
        $pdf->Cell(20,7,'$'.number_format($product_controller->getPrice($item['item_id']),2),1,0,'L',true);
        $total = $product_controller->getPrice($item['item_id'])*$item['qty'];
        $pdf->Cell(20,7,'$' . (number_format($total,2)),1,0,'L',true);
        $grand_total+=$total;

        $pdf->Ln();
    }


    $pdf->setXY(10,260);
    //$pdf->Cell(50,7,'Issued By: ',0,0,'R',true);
    //  $pdf->Line(10,250,200,250);


    $pdf->setXY(10,220);
    $pdf->SetFont('Arial','',12);
    $pdf->Cell(168,7,'SubTotal: $'. number_format($grand_total,2),0,1,'R',true);
    $pdf->Cell(168,7,'Discount: $'. number_format(0,2),0,1,'R',true);
    $pdf->Cell(168,7,'Freight: $'. number_format(0,2),0,1,'R',true);
    $pdf->Cell(168,7,'Add. Charges: $'. number_format(0,2),0,1,'R',true);
    $pdf->Ln(4);
    $pdf->SetFont('Arial','B',12);
    $pdf->Line(10,250,200,250);

    $pdf->Cell(168,7,'Total: $'. number_format($grand_total,2),0,0,'R',true);

    $pdf->Output();
    exit;
}