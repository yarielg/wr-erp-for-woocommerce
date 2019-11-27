Ext.ns('Wrerp.Main');

    let wrerp_administration_panel = new Ext.Panel({
        title: 'Administration',
        collapsed: true,
        iconCls: 'wrerp_administration',
        cls:'wrerp_panel_title'
    });

    //wrerp_administration_panel.col

    let wrerp_sales_ar_panel = new Ext.Panel({
        title: 'Sales A/R',
        collapsed: true,
        iconCls: 'wrerp_sales_ar',
        cls:'wrerp_panel_title',
        items: [{
            xtype: 'menuitem',
            text: 'Sales Quotation',
            iconCls: 'wrerp_menu_item',
            handler: function(){

                if( Wrerp.Main.wrerp_doc_quo == null){
                    win_quo = new Wrerp.Sales.winQuotation({
                        title: 'Sales Quotation - New',
                    }).show();
                    Wrerp.Main.wrerp_doc_quo = win_quo;
                }else{
                    //Wrerp.Main.wrerp_doc_quo.toFront();
                    //Wrerp.Main.wrerp_doc_quo.center();
                }

            }
        }]
    });

    let wrerp_purchasing_ap_panel = new Ext.Panel({
        title: 'Purchasing A/P',
        html: '&lt;empty panel&gt;',
        collapsed: true,
        iconCls: 'wrerp_purchasing_ap',
        cls:'wrerp_panel_title'
    });

    let wrerp_business_partners_panel = new Ext.Panel({
        title: 'Business Partners',
        html: '&lt;empty panel&gt;',
        collapsed: true,
        iconCls: 'wrerp_business_partners',
        cls:'wrerp_panel_title'
    });

    let wrerp_inventory_panel = new Ext.Panel({
        title: 'Inventory',
        iconCls: 'wrerp_inventory',
        collapsed: true,
        cls:'wrerp_panel_title',
        items:[
            {
                xtype: 'menuitem',
                text: 'Product Data Master',
                iconCls: 'wrerp_menu_item',
                handler: function(){

                    new Wrerp.Inv.winProducts({
                        title:'Products'
                    }).show();

                }
            },{
                xtype: 'menuitem',
                text: 'Bin Locations',
                iconCls: 'wrerp_menu_item',
                handler: function(){
                    alert('sadasd here');
                }
            }]
    });

