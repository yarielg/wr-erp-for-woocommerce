Ext.ns('Wrerp.Inv');

Wrerp.Inv.winProducts= Ext.extend(Ext.Window, {
    constructor: function(options) {
        let _this = this;
        this.parentWindow = options.parentWindow || null;

        this.searchText = options.searchText || '';

        this.storeProducts = new Ext.data.JsonStore({
            url: parameters.ajax_url,
            root: 'data',
            totalProperty: 'total',
            baseParams: {
                action: 'get_all_products',
                search: this.searchText
            },
            fields: ['ID','meta_value', 'post_title','price', 'post_type','post_status','_manage_stock','_stock_status','_stock','quantity'],
        });

        this.storeProducts.load();

        this.tbProducts = new Ext.Toolbar({
            items: [
                'Search: ',
                {
                    xtype: 'textfield',
                    name: 'tf_search_products',
                    emptyText: this.searchText,
                    height:40,
                    enableKeyEvents: true,

                    listeners:{
                        'keyup': function(text,e){
                           // if(text.getValue().length > 2 ){
                                _this.gpProducts.store.load({
                                    params:{
                                        action: 'get_all_products',
                                        'search': text.getValue(),
                                }
                                });
                           // }
                        }
                    }
                }]
        });

        this.gpProducts = new Ext.grid.GridPanel({
            store: this.storeProducts,
            columnLines: true,
            frame: true,
            columns: [
                {
                    header: 'Id',
                    width: 22,
                    //hidden:true,
                    resizable: false,
                    hideable: false,
                    menuDisabled: true,
                    dataIndex: 'ID'
                },
                {
                    header:'SKU',
                    width: 90,
                    dataIndex: 'meta_value'
                }
                , {
                    header: 'Name',
                    width: 250,
                    dataIndex: 'post_title',
                },
                {
                    header: 'Price',
                    width: 60,
                    dataIndex: 'price',
                },
                {
                    header: 'Type',
                    width: 100,
                    dataIndex: 'post_type',
                },
                {
                    header: 'Status',
                    width: 100,
                    dataIndex: 'post_status',
                },{
                    header: 'Stock Status',
                    width: 100,
                    dataIndex: '_stock_status',
                },{
                    header: 'Stock',
                    width: 50,
                    dataIndex: '_stock',
                }
            ]
            ,
            tbar: _this.tbProducts,
            listeners: {
                "rowclick": function(grid, row, event) {
                     let store = _this.storeProducts;
                    _this.parentWindow.storeProducts.insert(0,store.getAt(row));
                    _this.close();

                }
            },
            loadMask: true
        });

        Wrerp.Inv.winProducts.superclass.constructor.apply(this, [{
            title: _this.title,
            //modal: true,
            bodyStyle: 'padding:5px;background-color:#fff;',
            layout: 'fit',
            frame: true,
            iconCls: 'wrerp_products',
            cls: 'wrerp_window',
            height:550,
            width: 1100,
            maximizable:true,
            resizable: true,
            manager: Wrerp.Main.wrerp_win_group,
            items: [{
                xtype: 'panel',
                layout: 'fit',
                items:[_this.gpProducts]
            }],
            buttons: [{
                text:'Choose',
                handler:function(){
                    alert('not implemented yet')
                }
            },{
                text:'Cancel',
                handler:function(){
                    _this.close();
                }
            }],
            listeners:{
                beforeclose:function(panel){
                    if(_this.parentWindow != null){
                        _this.parentWindow.enable();
                    }
                },
                /*activate:function (win) {
                    Wrerp.Main.wrerp_doc_active = win;
                },
                deactivate:function(win){
                    Wrerp.Main.wrerp_doc_active = null;
                }*/
            }
        }]);

        Ext.apply(this, options || {});
    }
});

