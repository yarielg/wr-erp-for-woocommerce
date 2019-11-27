Ext.ns('Wrerp.Main');

Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    // Ajax listeners
    var ajaxOpts = {
        enable: true,
        msg: 'Loading...',
        maskEl: Ext.getBody()
    };
    Ext.Ajax.on("beforerequest", function(conn, requestOpts) {
        var opts = Ext.apply({}, requestOpts.maskCfg || {}, ajaxOpts);
        if (opts.enable) {
            Ext.get(opts.maskEl).mask(opts.msg);
        }
    })
    Ext.Ajax.on("requestcomplete", function(conn, response, requestOpts) {
        var opts = Ext.apply({}, requestOpts.maskCfg || {}, ajaxOpts);
        Ext.get(opts.maskEl).unmask();
    });


    var wrerp_doc_quo= null;
    var wrerp_doc_active= null;

    var wrerp_main_layout = new Ext.Panel({
        renderTo: 'wrerp_container',
        height: 650,
        title: 'WR ERP v1.0.1',
        layout: 'border',
        items: [{
            region: 'north',
            height: 50,
            layout: 'fit',
            items: [wrerp_toolbar_admin]
        },{
            title: 'Event Manager',
            region: 'south',     // position for region
            height: 100,
            split: true,         // enable resizing
            minSize: 75,         // defaults to 50
            maxSize: 150,
            margins: '0 5 5 5'
        },{
            // xtype: 'panel' implied by default
            region:'west',
            margins: '5 0 0 5',
            width: 200,
            collapsible: true,
            cls: 'wrerp_west_panel',
            margins: '5 5 0 5', // adjust top margin when collapsed
            id: 'west-region-container',
            layout: 'accordion',
            items:[wrerp_administration_panel,wrerp_sales_ar_panel,wrerp_purchasing_ap_panel,wrerp_business_partners_panel,wrerp_inventory_panel]
        },{
            title: 'Center Region',
            region: 'center',     // center region is required, no width/height specified
            xtype: 'container',
            layout: 'fit',
            margins: '5 5 0 0'
        }]
    });
});
